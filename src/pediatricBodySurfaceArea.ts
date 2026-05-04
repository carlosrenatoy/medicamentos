export interface WeightOnlyBodySurfaceAreaInput {
  weightKg: number;
}

export type BodySurfaceAreaFormula = 'CosteffWeightOnlyEstimate';

export interface BodySurfaceAreaResult {
  bsaM2: number;
  formula: BodySurfaceAreaFormula;
  formulaText: string;
  inputRequired: 'weight_only';
  estimateOnly: true;
  safetyNote: string;
}

const round3 = (value: number) => Math.round((value + Number.EPSILON) * 1000) / 1000;
const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function assertPositiveNumber(value: number, fieldName: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }
}

export function estimateCosteffBsaFromWeight({ weightKg }: WeightOnlyBodySurfaceAreaInput): BodySurfaceAreaResult {
  assertPositiveNumber(weightKg, 'Weight');

  const bsaM2 = (4 * weightKg + 7) / (weightKg + 90);

  return {
    bsaM2: round3(bsaM2),
    formula: 'CosteffWeightOnlyEstimate',
    formulaText: 'Estimated BSA(m²) = (4 x weight(kg) + 7) / (weight(kg) + 90)',
    inputRequired: 'weight_only',
    estimateOnly: true,
    safetyNote: 'Emergency workflow: BSA is estimated from weight only. Prefer direct weight-based dosing whenever the validated regimen allows it.',
  };
}

export function calculateDoseByEstimatedBodySurfaceArea(input: {
  dosePerM2: number;
  weightKg: number;
  maxDose?: number;
}) {
  assertPositiveNumber(input.dosePerM2, 'Dose per m²');

  const bsa = estimateCosteffBsaFromWeight({ weightKg: input.weightKg });
  const rawDose = input.dosePerM2 * bsa.bsaM2;
  const finalDose = input.maxDose ? Math.min(rawDose, input.maxDose) : rawDose;

  return {
    ...bsa,
    dose: round2(finalDose),
    rawDose: round2(rawDose),
    maxApplied: Boolean(input.maxDose && rawDose > input.maxDose),
  };
}
