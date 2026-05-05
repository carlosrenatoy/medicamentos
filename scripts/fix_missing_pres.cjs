const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

const vasoTarget = '    name: "Vasopressina (Encrise)",\n    comment: "Uso em PCR e hipotensão resistente às catecolaminas. Dose máxima em bolus: 40 U.",\n    defaultVolume: 1,';
const vasoReplace = '    name: "Vasopressina (Encrise)",\n    comment: "Uso em PCR e hipotensão resistente às catecolaminas. Dose máxima em bolus: 40 U.",\n    presentations: [\n      { id: generateId(), description: "Ampola 20 U/mL", concentration_mg_ml: 20 }\n    ],\n    defaultVolume: 1,';

const labeTarget = '    name: "Labetalol (Trandate)",\n    comment: "Contraindicado em asma, DPOC e choque cardiogênico.",\n    defaultDrugMg: 5,\n    defaultVolume: 1,';
const labeReplace = '    name: "Labetalol (Trandate)",\n    comment: "Contraindicado em asma, DPOC e choque cardiogênico.",\n    presentations: [\n      { id: generateId(), description: "Ampola 5 mg/mL", concentration_mg_ml: 5 }\n    ],\n    defaultDrugMg: 5,\n    defaultVolume: 1,';

// Normalize newlines in the targets to match the file
const normalizedVasoTarget = vasoTarget.replace(/\n/g, '\r\n');
const normalizedVasoReplace = vasoReplace.replace(/\n/g, '\r\n');
const normalizedLabeTarget = labeTarget.replace(/\n/g, '\r\n');
const normalizedLabeReplace = labeReplace.replace(/\n/g, '\r\n');

// Attempt both LF and CRLF just in case
dataTs = dataTs.replace(vasoTarget, vasoReplace).replace(normalizedVasoTarget, normalizedVasoReplace);
dataTs = dataTs.replace(labeTarget, labeReplace).replace(normalizedLabeTarget, normalizedLabeReplace);

fs.writeFileSync('src/data.ts', dataTs, 'utf8');
console.log('Fixed missing presentations for Vasopressina and Labetalol!');
