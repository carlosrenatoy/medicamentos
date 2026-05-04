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
    blockingReasons.push('Base da dose ausente: peso, ASC estimada por peso, fixa, faixa etária ou faixa de peso.');
  }

  if (!regimen.doseUnit && regimen.doseBasis !== 'consultative') {
    blockingReasons.push('Unidade de dose ausente.');
  }

  if (regimen.doseBasis === 'estimated_bsa_from_weight') {
    warnings.push('ASC estimada apenas por peso. Exibir aviso ao médico e preferir dose diretamente por kg quando o protocolo permitir.');
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
