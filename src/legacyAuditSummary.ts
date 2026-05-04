import type { Medicine } from './types';
import { auditLegacyMedicine } from './legacyMedicineAudit';

export interface LegacyMedicineAuditSummaryItem {
  medicineName: string;
  blockerCount: number;
  warningCount: number;
  infoCount: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface LegacyMedicineAuditSummary {
  medicineCount: number;
  blockerCount: number;
  warningCount: number;
  infoCount: number;
  criticalMedicines: LegacyMedicineAuditSummaryItem[];
  allMedicines: LegacyMedicineAuditSummaryItem[];
}

const HIGH_RISK_WORDS = [
  'adrenalina',
  'epinefrina',
  'noradrenalina',
  'norepinefrina',
  'dopamina',
  'dobutamina',
  'milrinona',
  'vasopressina',
  'kcl',
  'potássio',
  'potassio',
  'bicarbonato',
  'cálcio',
  'calcio',
  'fenitoína',
  'fenitoina',
  'dexmedetomidina',
  'fentanil',
  'midazolam',
  'propofol',
  'nitroprussiato',
  'hidrocortisona',
];

function isHighRiskName(name: string) {
  const lower = name.toLowerCase();
  return HIGH_RISK_WORDS.some((word) => lower.includes(word));
}

function getPriority(medicine: Medicine, blockerCount: number, warningCount: number): LegacyMedicineAuditSummaryItem['priority'] {
  if (isHighRiskName(medicine.name) && blockerCount > 0) return 'critical';
  if (blockerCount > 0) return 'high';
  if (warningCount > 0) return 'medium';
  return 'low';
}

export function summarizeLegacyMedicineAudit(medicines: Medicine[]): LegacyMedicineAuditSummary {
  const allMedicines = medicines.map((medicine) => {
    const findings = auditLegacyMedicine(medicine);
    const blockerCount = findings.filter((finding) => finding.severity === 'blocker').length;
    const warningCount = findings.filter((finding) => finding.severity === 'warning').length;
    const infoCount = findings.filter((finding) => finding.severity === 'info').length;

    return {
      medicineName: medicine.name,
      blockerCount,
      warningCount,
      infoCount,
      priority: getPriority(medicine, blockerCount, warningCount),
    };
  });

  const blockerCount = allMedicines.reduce((total, item) => total + item.blockerCount, 0);
  const warningCount = allMedicines.reduce((total, item) => total + item.warningCount, 0);
  const infoCount = allMedicines.reduce((total, item) => total + item.infoCount, 0);
  const criticalMedicines = allMedicines
    .filter((item) => item.priority === 'critical' || item.priority === 'high')
    .sort((a, b) => b.blockerCount - a.blockerCount || b.warningCount - a.warningCount || a.medicineName.localeCompare(b.medicineName));

  return {
    medicineCount: medicines.length,
    blockerCount,
    warningCount,
    infoCount,
    criticalMedicines,
    allMedicines,
  };
}
