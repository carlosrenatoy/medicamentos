export type DoseUnit =
  | 'mcg/kg/min'
  | 'mcg/kg/h'
  | 'mg/kg/min'
  | 'mg/kg/h'
  | 'mg/kg/dose'
  | 'mg/kg/day'
  | 'mg/m2/dose'
  | 'mg/m2/day'
  | 'mcg/m2/dose'
  | 'mcg/m2/day'
  | 'mEq/kg/h'
  | 'mEq/kg/dose'
  | 'units/kg/h'
  | 'mg/h'
  | 'mcg/h'
  | 'fixed_mg'
  | 'fixed_mcg'
  | 'fixed_mL'
  | 'mL/h';

export type DoseBasis = 'weight' | 'bsa' | 'fixed' | 'age_band' | 'weight_band' | 'consultative';
export type AmountUnit = 'mcg' | 'mg' | 'g' | 'mEq' | 'units' | 'mL';
export type Route = 'IV' | 'IO' | 'IM' | 'SC' | 'VO' | 'IN' | 'NEB' | 'ET' | 'TOPICAL' | 'RECTAL';
export type AdministrationMode = 'bolus' | 'slow_push' | 'short_infusion' | 'intermittent' | 'continuous' | 'enteral' | 'inhaled' | 'intranasal' | 'consultative';
export type VenousAccess = 'peripheral' | 'central' | 'both' | 'not_applicable' | 'unknown';
export type DiluentCode = 'SF0_9' | 'SG5' | 'SG10' | 'AD' | 'RL' | 'none' | 'institutional_protocol' | 'unknown';
export type ValidationStatus = 'validated' | 'needs_source' | 'needs_pharmacy_review' | 'conflicting_sources' | 'draft_only';

export interface TrustedSource {
  id: string;
  title: string;
  organization: string;
  url: string;
  sourceType: 'institutional_protocol' | 'drug_label' | 'safety_guideline' | 'pharmacy_reference' | 'clinical_guideline' | 'calculation_method';
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
  sourceIds?: string[];
  validationStatus?: ValidationStatus;
}

export interface DoseRegimen {
  id: string;
  indication: string;
  route: Route;
  administrationMode: AdministrationMode;
  infusionType?: 'bolus' | 'intermittent' | 'continuous' | 'consultative';
  doseBasis: DoseBasis;
  doseMin?: number;
  doseMax?: number;
  defaultStartDose?: number;
  doseUnit?: DoseUnit;
  interval?: string;
  duration?: string;
  administrationTime?: string;
  absoluteMaxDose?: number;
  absoluteMaxDoseUnit?: AmountUnit;
  requiresBsa?: boolean;
  allowsWeightOnlyBsaEstimate?: boolean;
  requiresHeight?: boolean;
  notes?: string;
  sourceIds?: string[];
  validationStatus?: ValidationStatus;
}

export interface PreparationProfile {
  id: string;
  name: string;
  finalVolumeMl?: number;
  drugAmount?: number;
  drugUnit?: AmountUnit;
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
  standardDilution?: boolean;
  lockStandardPreparation?: boolean;
  showForecastOnlyAsConsumption?: boolean;
  reconstitutionText?: string;
  administrationText?: string;
  protectFromLight?: boolean;
  stabilityHours?: number;
  notes?: string;
  sourceIds?: string[];
  validationStatus?: ValidationStatus;
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
  validationStatus?: ValidationStatus;
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
  validationStatus: ValidationStatus;
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

export interface NonContinuousPrescriptionInput {
  medicine: StructuredMedicine;
  regimen: DoseRegimen;
  presentation?: DrugPresentation;
  preparation?: PreparationProfile;
  weightKg: number;
  bsaM2?: number;
  chosenDose?: number;
}

export interface PrescriptionReadiness {
  canGeneratePrescription: boolean;
  blockingReasons: string[];
  warnings: string[];
}
