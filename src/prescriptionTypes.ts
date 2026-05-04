export type DoseUnit =
  | 'mcg/kg/min'
  | 'mcg/kg/h'
  | 'mg/kg/min'
  | 'mg/kg/h'
  | 'mg/kg/dose'
  | 'mg/kg/day'
  | 'mEq/kg/h'
  | 'mEq/kg/dose'
  | 'units/kg/h'
  | 'mg/h'
  | 'mcg/h'
  | 'mL/h';

export type AmountUnit = 'mcg' | 'mg' | 'g' | 'mEq' | 'units';
export type Route = 'IV' | 'IO' | 'IM' | 'SC' | 'VO' | 'IN' | 'NEB' | 'ET';
export type VenousAccess = 'peripheral' | 'central' | 'both' | 'not_applicable';
export type DiluentCode = 'SF0_9' | 'SG5' | 'SG10' | 'AD' | 'RL' | 'none' | 'institutional_protocol';

export interface TrustedSource {
  id: string;
  title: string;
  organization: string;
  url: string;
  sourceType: 'institutional_protocol' | 'drug_label' | 'safety_guideline' | 'pharmacy_reference' | 'clinical_guideline';
  note?: string;
  accessedAt?: string;
}

export interface DrugPresentation {
  id: string;
  description: string;
  drugAmount: number;
  drugUnit: AmountUnit;
  volumeMl: number;
  concentrationAmount: number;
  concentrationUnit: AmountUnit;
  concentrationVolumeMl: number;
}

export interface DoseRegimen {
  id: string;
  indication: string;
  route: Route;
  infusionType: 'bolus' | 'intermittent' | 'continuous' | 'consultative';
  doseMin?: number;
  doseMax?: number;
  defaultStartDose?: number;
  doseUnit?: DoseUnit;
  absoluteMaxDose?: number;
  absoluteMaxDoseUnit?: AmountUnit;
  notes?: string;
  sourceIds?: string[];
}

export interface PreparationProfile {
  id: string;
  name: string;
  finalVolumeMl: number;
  drugAmount: number;
  drugUnit: AmountUnit;
  allowedDiluents: DiluentCode[];
  preferredDiluent: DiluentCode;
  forbiddenDiluents?: DiluentCode[];
  accessAllowed: VenousAccess;
  concentrationFinalAmount?: number;
  concentrationFinalUnit?: AmountUnit;
  concentrationFinalVolumeMl?: number;
  maxPeripheralConcentration?: number;
  maxCentralConcentration?: number;
  concentrationLimitUnit?: string;
  protectFromLight?: boolean;
  stabilityHours?: number;
  notes?: string;
  sourceIds?: string[];
}

export interface SafetyRules {
  highAlert: boolean;
  independentDoubleCheck: boolean;
  infusionPumpRequired?: boolean;
  extravasationRisk?: boolean;
  centralLinePreferred?: boolean;
  centralLineRequired?: boolean;
  monitor?: string[];
  incompatibleWith?: string[];
  warnings?: string[];
  sourceIds?: string[];
}

export interface StructuredMedicine {
  id: string;
  name: string;
  aliases?: string[];
  clinicalComment?: string;
  presentations: DrugPresentation[];
  regimens: DoseRegimen[];
  preparations: PreparationProfile[];
  safety: SafetyRules;
  sources: TrustedSource[];
  version: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface PrescriptionCalculationInput {
  weightKg: number;
  dose: number;
  doseUnit: DoseUnit;
  preparation: PreparationProfile;
  presentation: DrugPresentation;
}

export interface PrescriptionCalculationResult {
  medicationVolumeMl: number;
  diluentVolumeMl: number;
  finalVolumeMl: number;
  finalConcentrationAmountPerMl: number;
  finalConcentrationUnit: AmountUnit;
  doseAmountPerHour: number;
  doseAmountPerHourUnit: AmountUnit;
  rateMlHour: number;
  warnings: string[];
}
