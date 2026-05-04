export interface BodySurfaceAreaInput {
  weightKg: number;
  heightCm: number;
}

export interface WeightOnlyBodySurfaceAreaInput {
  weightKg: number;
}

export type BodySurfaceAreaFormula = 'Mosteller' | 'CosteffWeightOnlyEstimate';

export interface BodySurfaceAreaResult {
  bsaM2: number;
  formula: BodySurfaceAreaFormula;
  formulaText: string;
  requiresHeight: boolean;
  estimateOnly: boolean;
  safetyNote: string;
}

const round3 = (value: number) => Math.round((value + Number.EPSILON) * 1000) / 1000;
const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function assertPositiveNumber(value: number, fieldName: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }
}

export function calculateMostellerBsa({ weightKg, heightCm }: BodySurfaceAreaInput): BodySurfaceAreaResult {
  assertPositiveNumber(weightKg, 'Weight');
  assertPositiveNumber(heightCm, 'Height');

  const bsaM2 = Math.sqrt((heightCm * weightKg) / 3600);

  return {
    bsaM2: round3(bsaM2),
    formula: 'Mosteller',
    formulaText: 'BSA(m²) = sqrt((height(cm) x weight(kg)) / 3600)',
    requiresHeight: true,
    estimateOnly: false,
    safetyNote: 'Use when both weight and measured height are available.',
  };
}

export function estimateCosteffBsaFromWeight({ weightKg }: WeightOnlyBodySurfaceAreaInput): BodySurfaceAreaResult {
  assertPositiveNumber(weightKg, 'Weight');

  const bsaM2 = (4 * weightKg + 7) / (weightKg + 90);

  return {
    bsaM2: round3(bsaM2),
    formula: 'CosteffWeightOnlyEstimate',
    formulaText: 'Estimated BSA(m²) = (4 x weight(kg) + 7) / (weight(kg) + 90)',
    requiresHeight: false,
    estimateOnly: true,
    safetyNote: 'Weight-only BSA is an estimate. Prefer weight-based regimens in emergency flows unless a validated protocol explicitly requires BSA and accepts weight-only estimation.',
  };
}

export function calculateDoseByBodySurfaceArea(input: {
  dosePerM2: number;
  weightKg: number;
  heightCm?: number;
  maxDose?: number;
  allowWeightOnlyEstimate?: boolean;
}) {
  assertPositiveNumber(input.dosePerM2, 'Dose per m²');

  const bsa = input.heightCm
    ? calculateMostellerBsa({ weightKg: input.weightKg, heightCm: input.heightCm })
    : input.allowWeightOnlyEstimate
      ? estimateCosteffBsaFromWeight({ weightKg: input.weightKg })
      : (() => {
          throw new Error('Height is required for BSA dosing unless weight-only estimation is explicitly allowed.');
        })();

  const rawDose = input.dosePerM2 * bsa.bsaM2;
  const finalDose = input.maxDose ? Math.min(rawDose, input.maxDose) : rawDose;

  return {
    ...bsa,
    dose: round2(finalDose),
    rawDose: round2(rawDose),
    maxApplied: Boolean(input.maxDose && rawDose > input.maxDose),
  };
}
