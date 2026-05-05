export interface MedicineDose {
  id: string;
  label: string;
  instructions: string;
  mgPerKg?: number;
  maxPerKg?: number;
  maxDose?: number;
  unit?: string;
  divideBy?: number; // Number of doses per day (e.g., 4 for every 6h)
  intervalText?: string; // e.g., "de 6/6h"
  hideVolumeCalc?: boolean; // If true, never show the volume calculation (e.g., infusion or specific dilutions)
  defaultDrugMg?: number;
  defaultVolume?: number;
  ampouleConcentration_mg_ml?: number;
  presentations?: MedicinePresentation[];
}

export interface MedicinePresentation {
  id: string;
  description: string;
  concentration_mg_ml: number;
  isPill?: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  doses: MedicineDose[];
  comment: string;
  defaultDrugMg?: number;
  defaultVolume?: number;
  ampouleConcentration_mg_ml?: number;
  presentations?: MedicinePresentation[];
}

export interface VitalSignRange {
  ageGroup: string;
  heartRate?: string;
  respiratoryRate?: string;
  systolicBP?: string;
  diastolicBP?: string;
  meanBP?: string;
}

export interface GlasgowPediatricItem {
  domain: 'abertura_ocular' | 'resposta_verbal' | 'resposta_motora';
  score: number;
  child: string;
  infant: string;
}

export interface EmergencyEquipmentByWeight {
  equipment: string;
  kg3_5?: string;
  kg6_7?: string;
  kg8_9?: string;
  kg10_11?: string;
  kg12_14?: string;
  kg15_18?: string;
  kg19_23?: string;
  kg24_29?: string;
  kg30_36?: string;
}

export interface Toxidrome {
  syndrome: string;
  mentalStatus: string;
  pupils: string;
  vitalSigns: string;
  otherManifestations: string;
  commonAgents: string;
}

export interface AntidoteMapping {
  intoxicationType: string;
  antidote: string;
}
