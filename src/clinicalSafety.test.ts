import assert from 'node:assert/strict';
import { getDilutionMode, getForecastLabel, getPreparationVolumes } from './standardDilutionRules';
import { estimateCosteffBsaFromWeight } from './pediatricBodySurfaceArea';
import { auditLegacyMedicine } from './legacyMedicineAudit';
import type { Medicine } from './types';

function testStandardDilutionLock() {
  const rule = getDilutionMode({
    defaultDrugMg: 0.2,
    defaultVolumeMl: 50,
    ampouleConcentrationMgMl: 0.1,
  });

  assert.equal(rule.hasStandardDilution, true);
  assert.equal(rule.lockPreparationFields, true);
  assert.equal(rule.showForecastAsConsumptionOnly, true);
  assert.equal(getForecastLabel(rule.hasStandardDilution), 'Consumo estimado em 24 horas');
}

function testPreparationVolumes() {
  const result = getPreparationVolumes({
    totalDrugMg: 0.2,
    ampouleConcentrationMgMl: 0.1,
    finalVolumeMl: 50,
  });

  assert.equal(result.medicationVolumeMl, 2);
  assert.equal(result.diluentVolumeMl, 48);
  assert.equal(result.finalConcentrationMcgMl, 4);
}

function testInvalidPreparationIsBlocked() {
  assert.throws(() => getPreparationVolumes({
    totalDrugMg: 10,
    ampouleConcentrationMgMl: 1,
    finalVolumeMl: 5,
  }), /Medication volume is greater than final volume/);
}

function testWeightOnlyBsa() {
  const result = estimateCosteffBsaFromWeight({ weightKg: 10 });
  assert.equal(result.inputRequired, 'weight_only');
  assert.equal(result.estimateOnly, true);
  assert.equal(result.requiresHeight, undefined);
  assert.equal(result.bsaM2, 0.427);
}

function testLegacyAuditBlocksUnsafeInfusion() {
  const medicine: Medicine = {
    id: 'test',
    name: 'Noradrenalina Teste',
    comment: 'Não diluir em SF. Extravasamento produz necrose.',
    doses: [
      {
        id: 'dose-1',
        label: 'IV contínua',
        instructions: '0,05 a 2 mcg/kg/min',
        mgPerKg: 0.05,
        maxPerKg: 2,
        unit: 'mcg/min',
      },
    ],
  };

  const findings = auditLegacyMedicine(medicine);
  assert.ok(findings.some((finding) => finding.severity === 'blocker'));
  assert.ok(findings.some((finding) => finding.message.includes('Infusão contínua sem preparo estruturado')));
}

testStandardDilutionLock();
testPreparationVolumes();
testInvalidPreparationIsBlocked();
testWeightOnlyBsa();
testLegacyAuditBlocksUnsafeInfusion();

console.log('Clinical safety checks passed.');
