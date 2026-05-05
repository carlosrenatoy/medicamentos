const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

const targetAmoxil = `    name: "Amoxicilina (Amoxil)",
    comment: "Pode induzir rash em pacientes com infecção por EBV.",
    presentations: [
      { id: generateId(), description: "250 mg/5 mL = 50 mg/mL | 400 mg/5 mL = 80 mg/mL | 500 mg", concentration_mg_ml: 50 }
    ],
    doses: [
      { id: generateId(), label: "Infecção Leve/Moderada", instructions: "50 mg/kg/dia dividido em 2 a 3x", mgPerKg: 50, unit: "mg/dia" },
      { id: generateId(), label: "Infecção Grave/OMA", instructions: "80 a 100 mg/kg/dia dividido em 2 a 3x", mgPerKg: 80, maxPerKg: 100, unit: "mg/dia" }
    ]`;

const replaceAmoxil = `    name: "Amoxicilina (Amoxil)",
    comment: "Pode induzir rash em pacientes com infecção por EBV.",
    presentations: [
      { id: generateId(), description: "Suspensão 250 mg/5 mL", concentration_mg_ml: 50 },
      { id: generateId(), description: "Suspensão 400 mg/5 mL", concentration_mg_ml: 80 },
      { id: generateId(), description: "Cápsula 500 mg", concentration_mg_ml: 500, isPill: true }
    ],
    doses: [
      { id: generateId(), label: "Infecção Leve/Moderada", instructions: "50 mg/kg/dia (div 8h)", mgPerKg: 50, unit: "mg/dia", divideBy: 3, intervalText: "de 8/8h" },
      { id: generateId(), label: "Infecção Grave/OMA", instructions: "80 a 100 mg/kg/dia (div 8h)", mgPerKg: 80, maxPerKg: 100, unit: "mg/dia", divideBy: 3, intervalText: "de 8/8h" }
    ]`;

const targetClavulin = `    name: "Amoxicilina + Clavulanato (Clavulin)",
    comment: "Cuidado com reação adversa: diarreia, vômitos. A dose é calculada sempre em relação à Amoxicilina.",
    presentations: [
      { id: generateId(), description: "200 mg + 28,5 mg/5 mL = 40 mg/mL amox + 5,7 mg/mL clav | 400", concentration_mg_ml: 40 }
    ],
    doses: [
      { id: generateId(), label: "Dose comum", instructions: "25 a 45 mg/kg/dia (div 8h ou 12h)", mgPerKg: 25, maxPerKg: 45, unit: "mg/dia" },
      { id: generateId(), label: "Infecção Grave/OMA", instructions: "90 mg/kg/dia (div 12h)", mgPerKg: 90, unit: "mg/dia" }
    ]`;

const replaceClavulin = `    name: "Amoxicilina + Clavulanato (Clavulin)",
    comment: "Cuidado com reação adversa: diarreia, vômitos. A dose é calculada sempre em relação à Amoxicilina.",
    presentations: [
      { id: generateId(), description: "Suspensão 250mg/5mL (comum)", concentration_mg_ml: 50 },
      { id: generateId(), description: "Suspensão 400mg/5mL (BD)", concentration_mg_ml: 80 },
      { id: generateId(), description: "Comprimido 500mg", concentration_mg_ml: 500, isPill: true },
      { id: generateId(), description: "Comprimido 875mg", concentration_mg_ml: 875, isPill: true }
    ],
    doses: [
      { id: generateId(), label: "Dose comum", instructions: "45 mg/kg/dia (div 12h)", mgPerKg: 45, unit: "mg/dia", divideBy: 2, intervalText: "de 12/12h" },
      { id: generateId(), label: "Infecção Grave/OMA", instructions: "90 mg/kg/dia (div 12h)", mgPerKg: 90, unit: "mg/dia", divideBy: 2, intervalText: "de 12/12h" }
    ]`;

const targetAzitromicina = `    name: "Azitromicina (Astro, Zithromax)",
    comment: "Deve ser administrada 1 ou 2 horas após as refeições, sem antiácidos com Mg ou Al.",
    presentations: [
      { id: generateId(), description: "200 mg/5 mL = 40 mg/mL | 500 mg", concentration_mg_ml: 40 }
    ],
    doses: [
      { id: generateId(), label: "Dose Usual (Dia 1)", instructions: "10 a 12 mg/kg no 1º dia (máx. 500 mg/dia)", mgPerKg: 10, maxPerKg: 12, maxDose: 500, unit: "mg" },
      { id: generateId(), label: "Dias seguintes (D2-D5)", instructions: "5 mg/kg/dia", mgPerKg: 5, maxDose: 250, unit: "mg" }
    ]`;

const replaceAzitromicina = `    name: "Azitromicina (Astro, Zithromax)",
    comment: "Deve ser administrada 1 ou 2 horas após as refeições, sem antiácidos com Mg ou Al.",
    presentations: [
      { id: generateId(), description: "Suspensão 600mg (15mL) ou 900mg (22,5mL) -> 200mg/5mL", concentration_mg_ml: 40 },
      { id: generateId(), description: "Comprimido 500mg", concentration_mg_ml: 500, isPill: true }
    ],
    doses: [
      { id: generateId(), label: "Dose Única Diária (3 dias)", instructions: "10 mg/kg/dia (1x ao dia por 3 dias)", mgPerKg: 10, maxDose: 500, unit: "mg/dia", divideBy: 1, intervalText: "1x ao dia" },
      { id: generateId(), label: "Dose Inicial (5 dias)", instructions: "10 mg/kg no 1º dia, depois 5 mg/kg (D2-D5)", mgPerKg: 10, maxDose: 500, unit: "mg/dia", divideBy: 1, intervalText: "1x ao dia" }
    ]`;


// Normalize newlines in the targets to match the file
const normalize = (t) => t.replace(/\r\n/g, '\n');

dataTs = normalize(dataTs);

dataTs = dataTs.replace(normalize(targetAmoxil), normalize(replaceAmoxil));
dataTs = dataTs.replace(normalize(targetClavulin), normalize(replaceClavulin));
dataTs = dataTs.replace(normalize(targetAzitromicina), normalize(replaceAzitromicina));

fs.writeFileSync('src/data.ts', dataTs, 'utf8');
console.log('Fixed Amoxicilina, Clavulin and Azitromicina presentations and doses!');
