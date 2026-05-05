/**
 * Audit script: Compare data.ts medicines against lote*.json
 * to identify enrichment gaps for each medicine.
 */
const fs = require('fs');

// Read data.ts
const datats = fs.readFileSync('src/data.ts', 'utf8');

// Extract medicine info from data.ts
const medicines = [];
const medRegex = /name:\s*"([^"]+)"/g;
let m;
while ((m = medRegex.exec(datats)) !== null) {
  const name = m[1];
  const startIdx = datats.lastIndexOf('{', m.index);
  
  // Check for presentations at medicine level
  const hasMedPres = datats.substring(startIdx, startIdx + 500).includes('presentations:');
  // Check for dose-level presentations  
  const blockEnd = Math.min(startIdx + 2000, datats.length);
  const block = datats.substring(startIdx, blockEnd);
  const hasDosePres = (block.match(/presentations:\s*\[/g) || []).length > 0;
  const hasDivideBy = block.includes('divideBy:');
  const hasIntervalText = block.includes('intervalText:');
  const hasCommercial = name.includes('(');
  const hasHideVolumeCalc = block.includes('hideVolumeCalc:');
  
  medicines.push({
    name,
    hasCommercial,
    hasPresentation: hasDosePres || hasMedPres,
    hasDivideBy,
    hasIntervalText,
    hasHideVolumeCalc
  });
}

// Read lote JSONs
const allLotes = [];
for (let i = 1; i <= 8; i++) {
  try {
    const data = JSON.parse(fs.readFileSync(`lote${i}.json`, 'utf8'));
    allLotes.push(...data);
  } catch(e) {}
}

// Summary
const noCommercial = medicines.filter(m => !m.hasCommercial);
const noPresentation = medicines.filter(m => !m.hasPresentation);
const noDivideBy = medicines.filter(m => !m.hasDivideBy);

console.log(`=== AUDIT: Phase 1.1 Gap Analysis ===`);
console.log(`Total medicines in data.ts: ${medicines.length}`);
console.log(`Total in lote JSONs: ${allLotes.length}`);
console.log('');
console.log(`--- Missing Commercial Name (${noCommercial.length}) ---`);
noCommercial.forEach(m => console.log(`  • ${m.name}`));
console.log('');
console.log(`--- Missing Presentations (${noPresentation.length}) ---`);
noPresentation.slice(0, 30).forEach(m => console.log(`  • ${m.name}`));
if (noPresentation.length > 30) console.log(`  ... and ${noPresentation.length - 30} more`);
console.log('');
console.log(`--- Has presentations (${medicines.length - noPresentation.length}) ---`);
medicines.filter(m => m.hasPresentation).forEach(m => console.log(`  ✓ ${m.name}`));
