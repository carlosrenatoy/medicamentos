const fs = require('fs');

const text = fs.readFileSync('src/data.ts', 'utf8');

const firstBox = text.search(/[├┤┬]/);
if (firstBox === -1) {
  console.log('✓ No box-drawing chars found!');
  process.exit(0);
}

const startComment = text.lastIndexOf('// ===== MEDICAÇÕES IMPORTADAS DOS LOTES', firstBox);
const startIndex = startComment !== -1 ? startComment : text.lastIndexOf('\n', firstBox);

const vitalSignsIndex = text.indexOf('export const VITAL_SIGNS');

if (vitalSignsIndex === -1 || vitalSignsIndex < startIndex) {
  console.error('Could not find VITAL_SIGNS properly.');
  process.exit(1);
}

const goodPartStart = text.substring(0, startIndex);
const badPart = text.substring(startIndex, vitalSignsIndex);
const goodPartEnd = text.substring(vitalSignsIndex);

const CP850 = [
  0x00C7, 0x00FC, 0x00E9, 0x00E2, 0x00E4, 0x00E0, 0x00E5, 0x00E7,
  0x00EA, 0x00EB, 0x00E8, 0x00EF, 0x00EE, 0x00EC, 0x00C4, 0x00C5,
  0x00C9, 0x00E6, 0x00C6, 0x00F4, 0x00F6, 0x00F2, 0x00FB, 0x00F9,
  0x00FF, 0x00D6, 0x00DC, 0x00F8, 0x00A3, 0x00D8, 0x00D7, 0x0192,
  0x00E1, 0x00ED, 0x00F3, 0x00E3, 0x00F1, 0x00D1, 0x00AA, 0x00BA,
  0x00BF, 0x00AE, 0x00AC, 0x00BD, 0x00BC, 0x00A1, 0x00AB, 0x00BB,
  0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x00C1, 0x00C2, 0x00C0,
  0x00A9, 0x2563, 0x2551, 0x2557, 0x255D, 0x00A2, 0x00A5, 0x2510,
  0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x00E3, 0x00C3,
  0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x00A4,
  0x00F0, 0x00D0, 0x00CA, 0x00CB, 0x00C8, 0x0131, 0x00CD, 0x00CE,
  0x00CF, 0x2518, 0x250C, 0x2588, 0x2584, 0x00A6, 0x00CC, 0x2580,
  0x00D3, 0x00DF, 0x00D4, 0x00D2, 0x00F5, 0x00D5, 0x00B5, 0x00FE,
  0x00DE, 0x00DA, 0x00DB, 0x00D9, 0x00FD, 0x00DD, 0x00AF, 0x00B4,
  0x00AD, 0x00B1, 0x2017, 0x00BE, 0x00B6, 0x00A7, 0x00F7, 0x00B8,
  0x00B0, 0x00A8, 0x00B7, 0x00B9, 0x00B3, 0x00B2, 0x25A0, 0x00A0,
];

const unicodeToCp850 = {};
for (let i = 0; i < CP850.length; i++) {
  unicodeToCp850[CP850[i]] = 0x80 + i;
}
for (let i = 0; i < 0x80; i++) {
  unicodeToCp850[i] = i;
}

function fixCp850(str) {
  const result = [];
  let rawBytes = [];
  
  function flushBytes() {
    if (rawBytes.length > 0) {
      try {
        const decoded = Buffer.from(rawBytes).toString('utf8');
        result.push(decoded);
      } catch(e) {
        rawBytes.forEach(b => result.push(String.fromCharCode(b)));
      }
      rawBytes = [];
    }
  }
  
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    if (code === 0xFFFD) continue;
    const cp850byte = unicodeToCp850[code];
    if (cp850byte !== undefined && code > 0x7F) {
      rawBytes.push(cp850byte);
    } else if (code <= 0x7F) {
      flushBytes();
      result.push(str[i]);
    } else {
      flushBytes();
      if (code > 0xFFFF) {
        result.push(str[i] + str[i+1]);
        i++;
      } else {
        result.push(str[i]);
      }
    }
  }
  flushBytes();
  return result.join('');
}

const fixedBadPart = fixCp850(badPart);
const final = goodPartStart + fixedBadPart + goodPartEnd;

const checks = {
  'Sódio': final.includes('Sódio'),
  'Ácido': final.includes('Ácido'),
  'Vecurônio': final.includes('Vecurônio'),
  'Acetilcisteína': final.includes('Acetilcisteína') || final.includes('Acetilciste'),
  'VITAL_SIGNS': final.includes('VITAL_SIGNS'),
  'TOXIDROMES': final.includes('TOXIDROMES'),
  'No replacement chars at end': !goodPartEnd.includes('\uFFFD')
};

console.log('\n=== VERIFICATION ===');
let allOk = true;
for (const [key, ok] of Object.entries(checks)) {
  console.log(`  ${ok ? '✓' : '✗'} ${key}`);
  if (!ok) allOk = false;
}

if (allOk) {
  fs.writeFileSync('src/data.ts', final, 'utf8');
  console.log('\n✓ FILE SAVED SUCCESSFULLY');
} else {
  console.log('\n✗ NOT saving - checks failed');
}
