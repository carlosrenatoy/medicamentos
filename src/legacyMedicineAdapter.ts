import type { Medicine, MedicineDose } from './types';
import type {
  AdministrationMode,
  DoseBasis,
  DoseRegimen,
  DoseUnit,
  StructuredMedicine,
} from './prescriptionTypes';

function inferDoseUnit(dose: MedicineDose): DoseUnit | undefined {
  const unit = (dose.unit ?? '').toLowerCase();
  if (unit.includes('mcg') && unit.includes('kg') && unit.includes('min')) return 'mcg/kg/min';
  if (unit.includes('mcg') && unit.includes('kg') && unit.includes('h')) return 'mcg/kg/h';
  if (unit.includes('mg') && unit.includes('kg') && unit.includes('h')) return 'mg/kg/h';
  if (unit.includes('mg') && unit.includes('dia')) return 'mg/kg/day';
  if (unit.includes('mg')) return 'mg/kg/dose';
  if (unit.includes('mcg')) return 'mcg/kg/h';
  if (unit.includes('meq') && unit.includes('h')) return 'mEq/kg/h';
  if (unit.includes('meq')) return 'mEq/kg/dose';
  if (unit.includes('ml')) return 'fixed_mL';
  return undefined;
}

function inferDoseBasis(dose: MedicineDose): DoseBasis {
  if (dose.mgPerKg !== undefined || dose.maxPerKg !== undefined) return 'weight';
  const label = `${dose.label} ${dose.instructions}`.toLowerCase();
  if (label.includes('kg')) return 'weight_band';
  return 'consultative';
}

function inferAdministrationMode(dose: MedicineDose): AdministrationMode {
  const text = `${dose.label} ${dose.instructions} ${dose.unit ?? ''}`.toLowerCase();
  if (text.includes('contínua') || text.includes('continua') || text.includes('/min') || text.includes('/h')) return 'continuous';
  if (text.includes('bolus')) return 'bolus';
  if (text.includes('nebul')) return 'inhaled';
  if (text.includes('intranasal') || text.includes(' in')) return 'intranasal';
  if (text.includes('vo') || text.includes('oral')) return 'enteral';
  if (text.includes('infundir') || text.includes('min')) return 'short_infusion';
  return 'consultative';
}

function inferRoute(dose: MedicineDose) {
  const text = `${dose.label} ${dose.instructions}`.toLowerCase();
  if (text.includes('vo') || text.includes('oral')) return 'VO' as const;
  if (text.includes('im')) return 'IM' as const;
  if (text.includes('intranasal') || text.includes(' in')) return 'IN' as const;
  if (text.includes('nebul')) return 'NEB' as const;
  if (text.includes('endotraqueal') || text.includes(' et')) return 'ET' as const;
  if (text.includes('io')) return 'IO' as const;
  if (text.includes('iv') || text.includes('ev')) return 'IV' as const;
  return 'IV' as const;
}

function mapDoseToRegimen(dose: MedicineDose): DoseRegimen {
  return {
    id: dose.id,
    indication: dose.label,
    route: inferRoute(dose),
    administrationMode: inferAdministrationMode(dose),
    doseBasis: inferDoseBasis(dose),
    doseMin: dose.mgPerKg,
    doseMax: dose.maxPerKg,
    doseUnit: inferDoseUnit(dose),
    absoluteMaxDose: dose.maxDose,
    absoluteMaxDoseUnit: dose.maxDose ? 'mg' : undefined,
    notes: dose.instructions,
    sourceIds: [],
    validationStatus: 'draft_only',
  };
}

export function adaptLegacyMedicineToStructured(medicine: Medicine): StructuredMedicine {
  return {
    id: medicine.id,
    name: medicine.name,
    aliases: [],
    clinicalComment: medicine.comment,
    presentations: [],
    regimens: medicine.doses.map(mapDoseToRegimen),
    preparations: medicine.defaultDrugMg && medicine.defaultVolume && medicine.ampouleConcentration_mg_ml
      ? [
          {
            id: `${medicine.id}-legacy-standard-preparation`,
            name: 'Preparo padrão herdado da base antiga',
            finalVolumeMl: medicine.defaultVolume,
            drugAmount: medicine.defaultDrugMg,
            drugUnit: 'mg',
            allowedDiluents: ['unknown'],
            preferredDiluent: 'unknown',
            accessAllowed: 'unknown',
            standardDilution: true,
            lockStandardPreparation: true,
            showForecastOnlyAsConsumption: true,
            notes: 'Preparo herdado do modelo antigo. Exige validação de fonte, diluente e acesso antes de prescrição automática.',
            sourceIds: [],
            validationStatus: 'draft_only',
          },
        ]
      : [],
    safety: {
      highAlert: false,
      independentDoubleCheck: false,
      warnings: medicine.comment ? [medicine.comment] : [],
      validationStatus: 'draft_only',
    },
    sources: [],
    version: 'legacy-adapter-v1',
    validationStatus: 'draft_only',
  };
}

export function adaptLegacyMedicinesToStructured(medicines: Medicine[]) {
  return medicines.map(adaptLegacyMedicineToStructured);
}
