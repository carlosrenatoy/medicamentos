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
