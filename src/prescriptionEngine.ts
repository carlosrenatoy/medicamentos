import type {
  AmountUnit,
  DoseUnit,
  PrescriptionCalculationInput,
  PrescriptionCalculationResult,
} from './prescriptionTypes';

const round = (value: number, decimals = 3) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const amountToMicrograms = (amount: number, unit: AmountUnit): number => {
  if (unit === 'mcg') return amount;
  if (unit === 'mg') return amount * 1000;
  if (unit === 'g') return amount * 1_000_000;
  throw new Error(`Cannot convert ${unit} to micrograms.`);
};

const microgramsToUnit = (amountMcg: number, targetUnit: AmountUnit): number => {
  if (targetUnit === 'mcg') return amountMcg;
  if (targetUnit === 'mg') return amountMcg / 1000;
  if (targetUnit === 'g') return amountMcg / 1_000_000;
  throw new Error(`Cannot convert micrograms to ${targetUnit}.`);
};

const calculateDosePerHourInMicrograms = (weightKg: number, dose: number, doseUnit: DoseUnit): number => {
  switch (doseUnit) {
    case 'mcg/kg/min':
      return dose * weightKg * 60;
    case 'mcg/kg/h':
      return dose * weightKg;
    case 'mg/kg/min':
      return dose * weightKg * 1000 * 60;
    case 'mg/kg/h':
      return dose * weightKg * 1000;
    case 'mg/h':
      return dose * 1000;
    case 'mcg/h':
      return dose;
    default:
      throw new Error(`Dose unit ${doseUnit} is not supported by the infusion engine yet.`);
  }
};

export function calculateContinuousInfusion(input: PrescriptionCalculationInput): PrescriptionCalculationResult {
  const { weightKg, dose, doseUnit, preparation, presentation } = input;
  const warnings: string[] = [];

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error('Weight must be a positive number.');
  }
  if (!Number.isFinite(dose) || dose <= 0) {
    throw new Error('Dose must be a positive number.');
  }
  if (!Number.isFinite(preparation.finalVolumeMl) || preparation.finalVolumeMl <= 0) {
    throw new Error('Final volume must be a positive number.');
  }

  const presentationAmountMcg = amountToMicrograms(presentation.drugAmount, presentation.drugUnit);
  const presentationConcentrationMcgMl = presentationAmountMcg / presentation.volumeMl;

  const preparationDrugAmountMcg = amountToMicrograms(preparation.drugAmount, preparation.drugUnit);
  const medicationVolumeMl = preparationDrugAmountMcg / presentationConcentrationMcgMl;
  const diluentVolumeMl = preparation.finalVolumeMl - medicationVolumeMl;

  if (diluentVolumeMl < 0) {
    throw new Error('Medication volume is greater than final volume. Review presentation and preparation.');
  }

  const finalConcentrationMcgMl = preparationDrugAmountMcg / preparation.finalVolumeMl;
  const dosePerHourMcg = calculateDosePerHourInMicrograms(weightKg, dose, doseUnit);
  const rateMlHour = dosePerHourMcg / finalConcentrationMcgMl;

  if (rateMlHour < 0.1) {
    warnings.push('Calculated rate is very low. Confirm pump precision and consider a less concentrated preparation if clinically appropriate.');
  }
  if (rateMlHour > 50) {
    warnings.push('Calculated rate is high. Confirm fluid allowance and consider a more concentrated preparation if clinically appropriate.');
  }

  const concentrationUnit = preparation.concentrationFinalUnit ?? preparation.drugUnit;
  const finalConcentrationAmountPerMl = microgramsToUnit(finalConcentrationMcgMl, concentrationUnit);
  const doseAmountPerHourUnit = doseUnit.includes('mg') ? 'mg' : 'mcg';
  const doseAmountPerHour = microgramsToUnit(dosePerHourMcg, doseAmountPerHourUnit);

  return {
    medicationVolumeMl: round(medicationVolumeMl, 3),
    diluentVolumeMl: round(diluentVolumeMl, 3),
    finalVolumeMl: round(preparation.finalVolumeMl, 3),
    finalConcentrationAmountPerMl: round(finalConcentrationAmountPerMl, 4),
    finalConcentrationUnit: concentrationUnit,
    doseAmountPerHour: round(doseAmountPerHour, 4),
    doseAmountPerHourUnit,
    rateMlHour: round(rateMlHour, 3),
    warnings,
  };
}

export function formatPrescriptionLine(input: {
  medicineName: string;
  diluentLabel: string;
  result: PrescriptionCalculationResult;
  dose: number;
  doseUnit: DoseUnit;
  weightKg: number;
}) {
  const { medicineName, diluentLabel, result, dose, doseUnit, weightKg } = input;

  return [
    `${medicineName}: preparar ${result.finalVolumeMl} mL.`,
    `Aspirar ${result.medicationVolumeMl} mL da medicação e completar com ${result.diluentVolumeMl} mL de ${diluentLabel}.`,
    `Concentração final: ${result.finalConcentrationAmountPerMl} ${result.finalConcentrationUnit}/mL.`,
    `Dose selecionada: ${dose} ${doseUnit} para ${weightKg} kg.`,
    `Infundir em bomba de infusão contínua a ${result.rateMlHour} mL/h.`,
  ].join('\n');
}
