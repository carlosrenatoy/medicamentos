import type {
  AmountUnit,
  DoseRegimen,
  DrugPresentation,
  NonContinuousPrescriptionInput,
  StructuredMedicine,
} from './prescriptionTypes';
import { auditPrescriptionReadiness } from './prescriptionReadiness';

const round = (value: number, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

function calculateDose(input: NonContinuousPrescriptionInput) {
  const { regimen, weightKg, estimatedBsaM2, chosenDose } = input;
  const dose = chosenDose ?? regimen.defaultStartDose ?? regimen.doseMin;

  if (!dose) {
    throw new Error('Dose is missing.');
  }

  if (regimen.doseBasis === 'weight') {
    return dose * weightKg;
  }

  if (regimen.doseBasis === 'estimated_bsa_from_weight') {
    if (!estimatedBsaM2) throw new Error('Estimated BSA from weight is required for this regimen.');
    return dose * estimatedBsaM2;
  }

  if (regimen.doseBasis === 'fixed') {
    return dose;
  }

  throw new Error(`Dose basis ${regimen.doseBasis} is not supported by this generator yet.`);
}

function inferDoseUnit(regimen: DoseRegimen): AmountUnit | 'unknown' {
  const unit = regimen.doseUnit ?? '';
  if (unit.includes('mcg')) return 'mcg';
  if (unit.includes('mg')) return 'mg';
  if (unit.includes('mEq')) return 'mEq';
  if (unit.includes('mL')) return 'mL';
  return 'unknown';
}

function calculatePresentationVolume(doseAmount: number, doseUnit: AmountUnit | 'unknown', presentation?: DrugPresentation) {
  if (!presentation || doseUnit === 'unknown') return undefined;
  if (presentation.concentrationUnit !== doseUnit) return undefined;
  return doseAmount / presentation.concentrationAmount * presentation.concentrationVolumeMl;
}

export function generateNonContinuousPrescription(input: NonContinuousPrescriptionInput) {
  const readiness = auditPrescriptionReadiness({
    medicine: input.medicine,
    regimen: input.regimen,
    preparation: input.preparation,
  });

  if (!readiness.canGeneratePrescription) {
    return {
      canGenerate: false,
      title: input.medicine.name,
      lines: [],
      blockingReasons: readiness.blockingReasons,
      warnings: readiness.warnings,
    };
  }

  const doseAmount = calculateDose(input);
  const doseUnit = inferDoseUnit(input.regimen);
  const volumeMl = calculatePresentationVolume(doseAmount, doseUnit, input.presentation);

  const lines = [
    `${input.medicine.name}: ${round(doseAmount)} ${doseUnit === 'unknown' ? '' : doseUnit}`.trim(),
    `Via: ${input.regimen.route}. Modo: ${input.regimen.administrationMode}.`,
  ];

  if (input.regimen.doseBasis === 'estimated_bsa_from_weight') {
    lines.push('Dose calculada por ASC estimada apenas pelo peso. Conferir indicação e protocolo.');
  }
  if (input.regimen.interval) lines.push(`Intervalo: ${input.regimen.interval}.`);
  if (input.regimen.administrationTime) lines.push(`Administração: ${input.regimen.administrationTime}.`);
  if (typeof volumeMl === 'number' && Number.isFinite(volumeMl)) lines.push(`Volume estimado pela apresentação cadastrada: ${round(volumeMl, 2)} mL.`);
  if (input.preparation?.reconstitutionText) lines.push(`Reconstituição/diluição: ${input.preparation.reconstitutionText}`);
  if (input.preparation?.administrationText) lines.push(`Observação de administração: ${input.preparation.administrationText}`);

  return {
    canGenerate: true,
    title: input.medicine.name,
    lines,
    blockingReasons: [],
    warnings: readiness.warnings,
  };
}

export function summarizePrescriptionGaps(medicine: StructuredMedicine) {
  const gaps: string[] = [];

  if (!medicine.presentations.length) gaps.push('Sem apresentação estruturada.');
  if (!medicine.regimens.length) gaps.push('Sem regimes de dose estruturados.');
  if (!medicine.sources.length) gaps.push('Sem fontes vinculadas.');
  if (medicine.validationStatus !== 'validated') gaps.push('Medicamento não validado para prescrição automática.');

  return gaps;
}
