import type { Medicine, MedicineDose } from './types';

export type LegacyAuditSeverity = 'blocker' | 'warning' | 'info';

export interface LegacyAuditFinding {
  severity: LegacyAuditSeverity;
  medicineName: string;
  doseLabel?: string;
  message: string;
}

const INFUSION_MARKERS = ['mcg/min', 'mcg/kg/min', 'mcg/kg/h', 'mg/kg/h', 'contínua', 'continua', 'bic'];
const ACCESS_MARKERS = ['perif', 'central', 'cvc', 'acesso central', 'acesso perif'];
const DILUTION_MARKERS = ['diluir', 'diluição', 'diluicao', 'sf', 'sg', 'soro', 'glicosado', 'fisiológico', 'fisiologico'];
const HIGH_RISK_MARKERS = ['adrenalina', 'epinefrina', 'noradrenalina', 'norepinefrina', 'dopamina', 'dobutamina', 'milrinona', 'kcl', 'potássio', 'potassio', 'bicarbonato', 'nitroprussiato', 'vasopressina', 'insulina'];

function textIncludesAny(text: string, markers: string[]) {
  const lower = text.toLowerCase();
  return markers.some((marker) => lower.includes(marker));
}

function isInfusionDose(dose: MedicineDose) {
  const text = `${dose.label} ${dose.instructions} ${dose.unit ?? ''}`;
  return textIncludesAny(text, INFUSION_MARKERS);
}

function hasStructuredStandardDilution(medicine: Medicine, dose: MedicineDose) {
  return Boolean(
    (dose.defaultDrugMg ?? medicine.defaultDrugMg) &&
    (dose.defaultVolume ?? medicine.defaultVolume) &&
    (dose.ampouleConcentration_mg_ml ?? medicine.ampouleConcentration_mg_ml),
  );
}

export function auditLegacyMedicine(medicine: Medicine): LegacyAuditFinding[] {
  const findings: LegacyAuditFinding[] = [];
  const comment = medicine.comment ?? '';
  const isHighRisk = textIncludesAny(medicine.name, HIGH_RISK_MARKERS) || textIncludesAny(comment, ['extravasamento', 'necrose', 'alto risco']);

  if (isHighRisk) {
    findings.push({
      severity: 'warning',
      medicineName: medicine.name,
      message: 'Medicamento possivelmente de alto risco: exige fonte, via, preparo, acesso e dupla checagem antes de prescrição automática.',
    });
  }

  if (textIncludesAny(comment, DILUTION_MARKERS)) {
    findings.push({
      severity: 'warning',
      medicineName: medicine.name,
      message: 'Há regra de diluição em texto livre. Migrar para preparo estruturado com diluente permitido/proibido e fonte.',
    });
  }

  if (textIncludesAny(comment, ACCESS_MARKERS)) {
    findings.push({
      severity: 'warning',
      medicineName: medicine.name,
      message: 'Há regra de acesso periférico/central em texto livre. Migrar para campo estruturado accessAllowed e limites de concentração.',
    });
  }

  medicine.doses.forEach((dose) => {
    if (dose.mgPerKg !== undefined && dose.unit && !dose.unit.toLowerCase().includes('mg')) {
      findings.push({
        severity: 'blocker',
        medicineName: medicine.name,
        doseLabel: dose.label,
        message: '`mgPerKg` está sendo usado com unidade diferente de mg. Migrar para doseMin/doseMax/doseUnit.',
      });
    }

    if (isInfusionDose(dose) && !hasStructuredStandardDilution(medicine, dose)) {
      findings.push({
        severity: 'blocker',
        medicineName: medicine.name,
        doseLabel: dose.label,
        message: 'Infusão contínua sem preparo estruturado completo. Não gerar prescrição automática.',
      });
    }

    if (isInfusionDose(dose) && hasStructuredStandardDilution(medicine, dose)) {
      findings.push({
        severity: 'info',
        medicineName: medicine.name,
        doseLabel: dose.label,
        message: 'Infusão com preparo padrão detectado. A previsão de 24h deve ser exibida apenas como consumo estimado.',
      });
    }

    if (!dose.unit && (dose.mgPerKg !== undefined || dose.maxPerKg !== undefined)) {
      findings.push({
        severity: 'blocker',
        medicineName: medicine.name,
        doseLabel: dose.label,
        message: 'Dose calculável sem unidade explícita.',
      });
    }
  });

  return findings;
}

export function auditLegacyMedicines(medicines: Medicine[]) {
  const findings = medicines.flatMap(auditLegacyMedicine);
  return {
    findings,
    blockers: findings.filter((finding) => finding.severity === 'blocker'),
    warnings: findings.filter((finding) => finding.severity === 'warning'),
    info: findings.filter((finding) => finding.severity === 'info'),
  };
}
