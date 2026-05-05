/**
 * Enrich data.ts medicines with presentations and commercial names.
 * LINE-BY-LINE approach to avoid offset bugs.
 */
const fs = require('fs');

// Load lote JSONs
const allLotes = [];
for (let i = 1; i <= 8; i++) {
  try {
    const data = JSON.parse(fs.readFileSync(`lote${i}.json`, 'utf8'));
    allLotes.push(...data);
  } catch(e) {}
}
console.log(`Loaded ${allLotes.length} medicines from lote JSONs`);

function normalize(name) {
  return name.toLowerCase()
    .replace(/\s*\(.*\)/, '')
    .replace(/\s*\/\s*.*/,'')
    .trim();
}

const loteByName = {};
allLotes.forEach(l => {
  loteByName[normalize(l.Medicamento)] = l;
});

// Commercial name map
const commercialNames = {
  'atropina': 'Atropion', 'ampicilina': 'Binotal', 'cefazolina': 'Kefazol',
  'cefepima': 'Maxcef', 'cefuroxima': 'Zinacef', 'ceftazidima': 'Fortaz',
  'ciprofloxacina': 'Cipro', 'gentamicina': 'Garamicina', 'meropenem': 'Meronem',
  'vancomicina': 'Vancocina', 'metronidazol': 'Flagyl', 'captopril': 'Capoten',
  'enalapril': 'Renitec', 'carbamazepina': 'Tegretol', 'digoxina': 'Lanoxin',
  'fluconazol': 'Diflucan', 'lorazepam': 'Lorax', 'aciclovir': 'Zovirax',
  'amlodipina': 'Norvasc', 'ácido valproico': 'Depakene', 'amicacina': 'Novamin',
  'anfotericina b': 'Fungizone', 'claritromicina': 'Klaricid', 'eritromicina': 'Eritrex',
  'espironolactona': 'Aldactone', 'hidroclorotiazida': 'Clorana', 'hidroxizina': 'Hixizine',
  'loratadina': 'Claritin', 'metoclopramida': 'Plasil', 'naproxeno': 'Flanax',
  'oxacilina': 'Staficilin-N', 'prednisona': 'Meticorten', 'ranitidina': 'Antak',
  'rifampicina': 'Rifaldin', 'doxiciclina': 'Vibramicina', 'imipenem': 'Tienam',
  'linezolida': 'Zyvox', 'levofloxacina': 'Levaquin', 'oseltamivir': 'Tamiflu',
  'voriconazol': 'Vfend', 'ganciclovir': 'Cymevene', 'lamivudina': 'Epivir',
  'zidovudina': 'AZT', 'diclofenaco': 'Voltaren', 'cloranfenicol': 'Quemicetina',
  'desloratadina': 'Desalex', 'dexclorfeniramina': 'Polaramine',
  'difenidramina': 'Difenidrin', 'dimenidrinato': 'Dramin', 'fenoterol': 'Berotec',
  'simeticona': 'Luftal', 'acetilcisteína': 'Fluimucil', 'glucagon': 'GlucaGen',
  'vitamina k1': 'Kanakion', 'vitamina d': 'Addera D3', 'cefadroxila': 'Cefamox',
  'sucralfato': 'Sucrafilm', 'mupirocina': 'Bactroban', 'nitrofurantoína': 'Macrodantina',
  'codeína': 'Codein', 'hidrato de cloral': 'Hidrato de Cloral',
};

// Parse concentration from apresentacao
function parseConcentration(apresentacao) {
  if (!apresentacao) return null;
  
  const mgMlMatch = apresentacao.match(/(\d+(?:[.,]\d+)?)\s*mg\s*\/\s*mL/i);
  if (mgMlMatch) return { desc: apresentacao.substring(0, 60).trim(), conc: parseFloat(mgMlMatch[1].replace(',', '.')) };
  
  const mgPerVolMatch = apresentacao.match(/(\d+)\s*mg\s*\/\s*(\d+)\s*mL/i);
  if (mgPerVolMatch) return { desc: apresentacao.substring(0, 60).trim(), conc: parseFloat(mgPerVolMatch[1]) / parseFloat(mgPerVolMatch[2]) };
  
  const mcgMlMatch = apresentacao.match(/(\d+(?:[.,]\d+)?)\s*mcg\s*\/\s*mL/i);
  if (mcgMlMatch) return { desc: apresentacao.substring(0, 60).trim(), conc: parseFloat(mcgMlMatch[1].replace(',', '.')) / 1000 };
  
  const percentMatch = apresentacao.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (percentMatch) return { desc: apresentacao.substring(0, 60).trim(), conc: parseFloat(percentMatch[1].replace(',', '.')) * 10 };
  
  return null;
}

// Process line by line
const lines = fs.readFileSync('src/data.ts', 'utf8').split('\n');
const output = [];
let changesCount = 0;
let currentMedicineName = null;
let hasPresentationsInBlock = false;
let needsPresentation = null; // holds the presentation to inject
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Detect medicine name
  const nameMatch = trimmed.match(/^name:\s*"([^"]+)"/);
  if (nameMatch) {
    currentMedicineName = nameMatch[1];
    hasPresentationsInBlock = false;
    needsPresentation = null;
    
    const normName = normalize(currentMedicineName);
    
    // Task 3: Add commercial name if missing
    if (!currentMedicineName.includes('(') && !currentMedicineName.includes('/')) {
      const commercial = commercialNames[normName];
      if (commercial) {
        const oldPart = `name: "${currentMedicineName}"`;
        const newPart = `name: "${currentMedicineName} (${commercial})"`;
        output.push(line.replace(oldPart, newPart));
        changesCount++;
        i++;
        continue;
      }
    }
    
    // Check if lote has presentation data for this medicine
    const loteEntry = loteByName[normName];
    if (loteEntry) {
      const pres = parseConcentration(loteEntry.Apresentacao_preenchida);
      if (pres) {
        needsPresentation = pres;
      }
    }
  }
  
  // Track if block already has presentations
  if (trimmed.startsWith('presentations:')) {
    hasPresentationsInBlock = true;
    needsPresentation = null; // Already has it
  }
  
  // Insert presentations BEFORE "doses: [" line if needed
  if (trimmed.startsWith('doses:') && needsPresentation && !hasPresentationsInBlock) {
    const indent = line.match(/^(\s*)/)[1];
    output.push(`${indent}presentations: [`);
    output.push(`${indent}  { id: generateId(), description: "${needsPresentation.desc}", concentration_mg_ml: ${needsPresentation.conc} }`);
    output.push(`${indent}],`);
    changesCount++;
    needsPresentation = null;
  }
  
  output.push(line);
  i++;
}

const result = output.join('\n');

// Verify
const checks = {
  'generateId()': result.includes('generateId()'),
  'INITIAL_MEDICINES': result.includes('INITIAL_MEDICINES'),
  'VITAL_SIGNS': result.includes('VITAL_SIGNS'),
  'Sódio': result.includes('Sódio'),
  'Cefalexina (Keflex)': result.includes('Cefalexina (Keflex)'),
};

console.log(`\nChanges made: ${changesCount}`);
let allOk = true;
for (const [k, v] of Object.entries(checks)) {
  console.log(`  ${v ? '✓' : '✗'} ${k}`);
  if (!v) allOk = false;
}

if (allOk && changesCount > 0) {
  fs.writeFileSync('src/data.ts', result, 'utf8');
  console.log('\n✓ File saved!');
} else if (!allOk) {
  console.log('\n✗ NOT saving - verification failed');
} else {
  console.log('\nNo changes needed.');
}
