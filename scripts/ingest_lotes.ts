/**
 * ingest_lotes.ts
 * Reads lote1.json through lote8.json,
 * maps each raw medication object to a Medicine compatible structure,
 * and writes them to stdout as a TypeScript array literal.
 */
import * as fs from 'fs';
import * as path from 'path';

interface RawMed {
  ID: string;
  Medicamento: string;
  Tipo_detectado?: string;
  Vias_detectadas?: string;
  'Infusão_contínua?'?: string;
  'Antimicrobiano?'?: string;
  'Alto_alerta?'?: string;
  Dose_original: string;
  'Comentário_original': string;
  Apresentacao_preenchida: string;
  Unidade_concentracao_calculo?: string;
  Concentracoes_para_app?: string;
  'Regra_de_cálculo_para_app'?: string;
  Preenchido_agora?: string;
  Status_calculo?: string;
  Fonte_preenchida?: string;
  Fonte_URL_Anvisa?: string;
  Prioridade?: string;
  O_que_falta_original?: string;
}

// Existing medicine names (normalized) to avoid duplicates
const EXISTING_NAMES = [
  "dexmedetomidina", "adenosina", "adrenalina", "cefalexina",
  "amiodarona", "atropina", "bicarbonato de sódio", "cetamina",
  "cloreto de potássio", "dobutamina", "dopamina", "etomidato",
  "fentanila", "fentanil", "flumazenil", "gluconato de cálcio",
  "lidocaína", "manitol", "midazolam", "milrinona", "naloxona",
  "norepinefrina", "nitroprussiato de sódio", "propofol", "rocurônio",
  "succinilcolina", "sugammadex", "ácido acetilsalicílico",
  "amoxicilina", "amoxicilina + clavulanato", "azitromicina",
  "ceftriaxona", "dipirona", "paracetamol", "ibuprofeno",
  "dexametasona", "prednisolona", "ondansetrona", "salbutamol",
  "furosemida", "fenobarbital", "fenitoína", "diazepam",
  "morfina", "tramadol", "cetoprofeno", "hidrocortisona",
  "metilprednisolona", "sulfato de magnésio", "nicardipina",
  "nitroglicerina", "octreotida", "vasopressina", "labetalol",
  "levosimendan", "amrinona", "fenoldopam", "prostaglandina e1",
  "somatostatina", "terbutalina", "tiopental", "propranolol",
  "oxicodona", "haloperidol", "hidralazina", "cloreto de cálcio",
  "glicose hipertônica", "omeprazol", "prometazina",
  "penicilina g benzatina", "clindamicina", "cefotaxima"
];

function normalize(name: string): string {
  return name.toLowerCase()
    .replace(/\s*\(.*\)/, '') // Remove parenthetical
    .replace(/\s+/g, ' ')
    .trim();
}

function isExisting(name: string): boolean {
  const norm = normalize(name);
  return EXISTING_NAMES.some(e => norm.includes(e) || e.includes(norm));
}

function escapeTS(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

function parseDoses(raw: RawMed): string[] {
  const doses: string[] = [];
  const doseText = raw.Dose_original;
  
  // Try to extract concentration from Apresentacao_preenchida
  let concStr = '';
  const concMatch = raw.Apresentacao_preenchida?.match(/(\d+[\.,]?\d*)\s*mg\/mL/);
  if (concMatch) {
    concStr = concMatch[1].replace(',', '.');
  }
  
  // Split dose text by route markers or semicolons or newlines
  const segments = doseText.split(/(?:\\n|\n|(?=(?:IV|VO|IM|SC|IN|IO|ET|NEB|SRI|Infusão|PCR|Oral|Ataque|Manutenção)[:\s]))/);
  
  for (const seg of segments) {
    const trimmed = seg.trim();
    if (!trimmed || trimmed.length < 3) continue;
    
    // Try to extract mg/kg value
    const mgMatch = trimmed.match(/(\d+[\.,]?\d*)\s*(?:a\s+(\d+[\.,]?\d*)\s+)?(?:mg|mcg|mEq|U|g)\/kg/i);
    const maxMatch = trimmed.match(/máx(?:imo|\.?)?\s*(?:de\s+)?(\d+[\.,]?\d*)\s*(?:mg|mcg|mEq|g)/i);
    
    let mgPerKg: number | null = null;
    let maxPerKg: number | null = null;
    let maxDose: number | null = null;
    let unit = 'mg';
    
    if (mgMatch) {
      mgPerKg = parseFloat(mgMatch[1].replace(',', '.'));
      if (mgMatch[2]) {
        maxPerKg = parseFloat(mgMatch[2].replace(',', '.'));
      }
      // Detect unit
      const unitMatch = trimmed.match(/(\d+[\.,]?\d*)\s*(?:a\s+\d+[\.,]?\d*\s+)?(mg|mcg|mEq|U|g)\/kg/i);
      if (unitMatch) unit = unitMatch[2];
    }
    
    if (maxMatch) {
      maxDose = parseFloat(maxMatch[1].replace(',', '.'));
    }
    
    // Generate a label from the beginning of the segment
    let label = trimmed.substring(0, Math.min(60, trimmed.length));
    // Clean up label - take up to first colon or period
    const colonIdx = label.indexOf(':');
    if (colonIdx > 0 && colonIdx < 50) {
      label = label.substring(0, colonIdx);
    }
    label = label.replace(/[,;.]$/, '').trim();
    if (label.length > 50) label = label.substring(0, 50) + '...';
    
    let doseObj = `      { id: generateId(), label: "${escapeTS(label)}", instructions: "${escapeTS(trimmed)}"`;
    
    if (mgPerKg !== null) {
      doseObj += `, mgPerKg: ${mgPerKg}`;
    }
    if (maxPerKg !== null) {
      doseObj += `, maxPerKg: ${maxPerKg}`;
    }
    if (maxDose !== null) {
      doseObj += `, maxDose: ${maxDose}`;
    }
    doseObj += `, unit: "${unit}"`;
    doseObj += ` }`;
    
    doses.push(doseObj);
  }
  
  // Fallback: if no doses parsed, create a single dose with the full text
  if (doses.length === 0) {
    doses.push(`      { id: generateId(), label: "Dose padrão", instructions: "${escapeTS(doseText)}", unit: "mg" }`);
  }
  
  return doses;
}

function buildMedicine(raw: RawMed): string {
  const comment = raw['Comentário_original'] || '';
  const doses = parseDoses(raw);
  
  // Build presentations from Apresentacao_preenchida
  let presentations = '';
  const apresentacao = raw.Apresentacao_preenchida;
  if (apresentacao) {
    const concParts: string[] = [];
    // Match patterns like "50 mg/mL" or "1:1000 = 1 mg/mL" or "100 mg/mL"
    const concMatches = apresentacao.matchAll(/(\d+[\.,]?\d*)\s*(?:mg|mcg|mEq|g|UI|U)\/(?:mL|ml)/gi);
    for (const m of concMatches) {
      const val = parseFloat(m[1].replace(',', '.'));
      concParts.push(`      { id: generateId(), description: "${escapeTS(apresentacao)}", concentration_mg_ml: ${val} }`);
    }
    // Also try pill patterns
    const pillMatch = apresentacao.match(/(\d+)\s*mg(?:\s+comprimido|\s+cápsula|\s+cp|\s+caps)/i);
    if (pillMatch) {
      concParts.push(`      { id: generateId(), description: "${escapeTS(apresentacao)}", concentration_mg_ml: ${pillMatch[1]}, isPill: true }`);
    }
    // If Concentracoes_para_app is filled, use those
    if (raw.Concentracoes_para_app && raw.Concentracoes_para_app.trim()) {
      const concs = raw.Concentracoes_para_app.split(';').map(c => c.trim()).filter(c => c);
      if (concs.length > 0) {
        concParts.length = 0; // Reset
        for (const c of concs) {
          const val = parseFloat(c.replace(',', '.'));
          if (!isNaN(val)) {
            concParts.push(`      { id: generateId(), description: "${escapeTS(apresentacao)} (${val})", concentration_mg_ml: ${val} }`);
          }
        }
      }
    }
    if (concParts.length > 0) {
      presentations = `    presentations: [\n${concParts.join(',\n')}\n    ],\n`;
    }
  }
  
  return `  {
    id: generateId(),
    name: "${escapeTS(raw.Medicamento)}",
    comment: "${escapeTS(comment)}",
${presentations}    doses: [
${doses.join(',\n')}
    ]
  }`;
}

// Main
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const allMeds: RawMed[] = [];

for (let i = 1; i <= 8; i++) {
  const filePath = path.join(rootDir, `lote${i}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    allMeds.push(...data);
  }
}

// Filter out duplicates that already exist
const newMeds = allMeds.filter(m => !isExisting(m.Medicamento));

console.log(`// ===== AUTO-GENERATED FROM lote*.json =====`);
console.log(`// Total in JSONs: ${allMeds.length}, New (not already in data.ts): ${newMeds.length}`);
console.log(`// Generated: ${new Date().toISOString()}`);
console.log('');

const output = newMeds.map(m => buildMedicine(m)).join(',\n');
console.log(output);
