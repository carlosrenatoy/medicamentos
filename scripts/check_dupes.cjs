const fs = require('fs');
const d = fs.readFileSync('src/data.ts', 'utf8');
const names = [];
const re = /name:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(d)) !== null) {
  names.push(m[1]);
}
console.log('Total medicines:', names.length);

// Check for duplicates by normalizing first word
const seen = {};
const realDupes = [];
names.forEach(n => {
  // normalize: lowercase, remove parenthetical, take first 2 significant words
  const norm = n.toLowerCase()
    .replace(/\s*\(.*\)/, '')
    .replace(/\s*\/\s*/g, ' ')
    .trim();
  const key = norm.split(/\s+/).slice(0, 2).join(' ');
  if (seen[key]) {
    realDupes.push([seen[key], n]);
  } else {
    seen[key] = n;
  }
});

if (realDupes.length === 0) {
  console.log('No duplicates found!');
} else {
  console.log('Possible duplicates:');
  realDupes.forEach(d => console.log('  -', d[0], ' VS ', d[1]));
}
