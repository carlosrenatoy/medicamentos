import type {
  DoseRegimen,
  PreparationProfile,
  PrescriptionReadiness,
  StructuredMedicine,
} from './prescriptionTypes';

const isValidated = (status?: string) => status === 'validated';

export function auditPrescriptionReadiness(input: {
  medicine: StructuredMedicine;
  regimen: DoseRegimen;
  preparation?: PreparationProfile;
}): PrescriptionReadiness {
  const blockingReasons: string[] = [];
  const warnings: string[] = [];
  const { medicine, regimen, preparation } = input;

  if (!isValidated(medicine.validationStatus)) {
    blockingReasons.push('Medicamento ainda não validado para prescrição automática.');
  }

  if (!isValidated(regimen.validationStatus)) {
    blockingReasons.push('Regime de dose ainda não validado com fonte confiável.');
  }

  if (!regimen.doseBasis) {
    blockingReasons.push('Base da dose ausente: peso, superfície corpórea, fixa, faixa etária ou faixa de peso.');
  }

  if (!regimen.doseUnit && regimen.doseBasis !== 'consultative') {
    blockingReasons.push('Unidade de dose ausente.');
  }

  if (regimen.doseBasis === 'bsa' && regimen.requiresHeight && !regimen.allowsWeightOnlyBsaEstimate) {
    warnings.push('Este regime exige superfície corpórea com altura medida. Não usar fluxo rápido apenas por peso.');
  }

  if (regimen.doseBasis === 'bsa' && regimen.allowsWeightOnlyBsaEstimate) {
    warnings.push('Superfície corpórea por peso é estimativa. Exibir aviso ao médico.');
  }

  if (regimen.administrationMode === 'continuous') {
    if (!preparation) {
      blockingReasons.push('Infusão contínua sem preparo estruturado.');
    }

    if (preparation && !isValidated(preparation.validationStatus)) {
      blockingReasons.push('Preparo da infusão ainda não validado.');
    }

    if (preparation && preparation.accessAllowed === 'unknown') {
      blockingReasons.push('Acesso periférico/central não definido.');
    }

    if (preparation && !preparation.allowedDiluents.length) {
      blockingReasons.push('Diluente permitido não definido.');
    }
  }

  if (medicine.sources.length === 0) {
    blockingReasons.push('Nenhuma fonte vinculada ao medicamento.');
  }

  if (medicine.safety.highAlert && !medicine.safety.independentDoubleCheck) {
    warnings.push('Medicamento de alto risco sem dupla checagem independente configurada.');
  }

  return {
    canGeneratePrescription: blockingReasons.length === 0,
    blockingReasons,
    warnings,
  };
}

export function getReadinessBadge(readiness: PrescriptionReadiness) {
  if (readiness.canGeneratePrescription && readiness.warnings.length === 0) return 'validado';
  if (readiness.canGeneratePrescription && readiness.warnings.length > 0) return 'validado com alertas';
  return 'bloqueado para prescrição automática';
}
