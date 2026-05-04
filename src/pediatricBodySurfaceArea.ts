export interface BodySurfaceAreaInput {
  weightKg: number;
  heightCm: number;
}

export interface BodySurfaceAreaResult {
  bsaM2: number;
  formula: 'Mosteller';
  formulaText: string;
}

export function calculateMostellerBsa({ weightKg, heightCm }: BodySurfaceAreaInput): BodySurfaceAreaResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error('Weight must be a positive number.');
  }

  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new Error('Height must be a positive number.');
  }

  const bsaM2 = Math.sqrt((heightCm * weightKg) / 3600);

  return {
    bsaM2: Math.round((bsaM2 + Number.EPSILON) * 1000) / 1000,
    formula: 'Mosteller',
    formulaText: 'BSA(m²) = sqrt((height(cm) x weight(kg)) / 3600)',
  };
}

export function calculateDoseByBodySurfaceArea(input: {
  dosePerM2: number;
  weightKg: number;
  heightCm: number;
  maxDose?: number;
}) {
  const bsa = calculateMostellerBsa({ weightKg: input.weightKg, heightCm: input.heightCm });
  const rawDose = input.dosePerM2 * bsa.bsaM2;
  const finalDose = input.maxDose ? Math.min(rawDose, input.maxDose) : rawDose;

  return {
    ...bsa,
    dose: Math.round((finalDose + Number.EPSILON) * 100) / 100,
    rawDose: Math.round((rawDose + Number.EPSILON) * 100) / 100,
    maxApplied: Boolean(input.maxDose && rawDose > input.maxDose),
  };
}
