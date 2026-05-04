export interface MedicineDose {
  id: string;
  label: string;
  instructions: string;
  mgPerKg?: number;
  maxPerKg?: number;
  maxDose?: number;
  unit?: string;
  defaultDrugMg?: number;
  defaultVolume?: number;
  ampouleConcentration_mg_ml?: number;
}

export interface Medicine {
  id: string;
  name: string;
  doses: MedicineDose[];
  comment: string;
  defaultDrugMg?: number;
  defaultVolume?: number;
  ampouleConcentration_mg_ml?: number;
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
  neonate?: string;
  infant?: string;
  childSmall?: string;
  childMedium?: string;
  childLarge?: string;
  adult?: string;
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
