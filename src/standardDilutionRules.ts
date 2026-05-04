export type DilutionMode = 'standard_fixed' | 'calculated_custom';

export interface StandardDilutionCheckInput {
  defaultDrugMg?: number;
  defaultVolumeMl?: number;
  ampouleConcentrationMgMl?: number;
}

export interface StandardDilutionCheckResult {
  mode: DilutionMode;
  hasStandardDilution: boolean;
  lockPreparationFields: boolean;
  showForecastAsConsumptionOnly: boolean;
  warningTitle: string;
  warningText: string;
}

function assertPositive(value: number, fieldName: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }
}

export function getDilutionMode(input: StandardDilutionCheckInput): StandardDilutionCheckResult {
  const hasStandardDilution = Boolean(
    input.defaultDrugMg &&
    input.defaultDrugMg > 0 &&
    input.defaultVolumeMl &&
    input.defaultVolumeMl > 0 &&
    input.ampouleConcentrationMgMl &&
    input.ampouleConcentrationMgMl > 0,
  );

  if (hasStandardDilution) {
    return {
      mode: 'standard_fixed',
      hasStandardDilution: true,
      lockPreparationFields: true,
      showForecastAsConsumptionOnly: true,
      warningTitle: 'Diluição padrão cadastrada',
      warningText: 'Manter o preparo padrão cadastrado. A previsão de 24 horas é apenas estimativa de consumo da solução e não deve alterar a quantidade total da droga, o volume final ou a concentração final.',
    };
  }

  return {
    mode: 'calculated_custom',
    hasStandardDilution: false,
    lockPreparationFields: false,
    showForecastAsConsumptionOnly: false,
    warningTitle: 'Diluição não padronizada',
    warningText: 'Antes de usar o cálculo, conferir protocolo institucional, diluente, concentração máxima, via e tipo de acesso.',
  };
}

export function getPreparationVolumes(input: {
  totalDrugMg: number;
  ampouleConcentrationMgMl: number;
  finalVolumeMl: number;
}) {
  assertPositive(input.totalDrugMg, 'Total drug amount');
  assertPositive(input.ampouleConcentrationMgMl, 'Ampoule concentration');
  assertPositive(input.finalVolumeMl, 'Final volume');

  const medicationVolumeMl = input.totalDrugMg / input.ampouleConcentrationMgMl;
  const diluentVolumeMl = input.finalVolumeMl - medicationVolumeMl;

  if (diluentVolumeMl < 0) {
    throw new Error('Medication volume is greater than final volume. Review standard preparation.');
  }

  const finalConcentrationMcgMl = (input.totalDrugMg * 1000) / input.finalVolumeMl;

  return {
    medicationVolumeMl,
    diluentVolumeMl,
    finalConcentrationMcgMl,
  };
}

export function getForecastLabel(hasStandardDilution: boolean) {
  return hasStandardDilution ? 'Consumo estimado em 24 horas' : 'Previsão para 24 horas';
}
