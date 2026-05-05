const fs = require('fs');

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

// List of all the known mangled strings with replacement characters
// The replacement character in the file is U+FFFD ()
const REPLACEMENT_CHAR = '\uFFFD';

const fixes = [
  [`Acetilciste${REPLACEMENT_CHAR}na`, 'Acetilcisteína'],
  [`${REPLACEMENT_CHAR}cido Valproico`, 'Ácido Valproico'],
  [`Carv${REPLACEMENT_CHAR}o Ativado`, 'Carvão Ativado'],
  [`Code${REPLACEMENT_CHAR}na`, 'Codeína'],
  [`EDTA C${REPLACEMENT_CHAR}lcico`, 'EDTA Cálcico'],
  [`Hidróxido de Alum${REPLACEMENT_CHAR}nio`, 'Hidróxido de Alumínio'],
  [`Hidróxido de Magn${REPLACEMENT_CHAR}sio`, 'Hidróxido de Magnésio'],
  [`Nitrofuranto${REPLACEMENT_CHAR}na`, 'Nitrofurantoína'],
  [`Penicilina Proca${REPLACEMENT_CHAR}na`, 'Penicilina Procaína'],
  [`c${REPLACEMENT_CHAR}lcio - Sorcal${REPLACEMENT_CHAR}`, 'cálcio - Sorcal®'],
  [`referente ${REPLACEMENT_CHAR} trimetoprima`, 'referente à trimetoprima'],
];

fixes.forEach(([bad, good]) => {
  dataTs = dataTs.split(bad).join(good);
});

fs.writeFileSync('src/data.ts', dataTs, 'utf8');
console.log('Fixed replacement characters successfully.');
