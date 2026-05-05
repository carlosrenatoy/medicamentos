const fs = require('fs');
const buf = fs.readFileSync('src/data.ts');

// Find where the bad encoding starts - check around a known bad string
const text = buf.toString('utf8');
const idx = text.indexOf('Vecur');
if (idx >= 0) {
  // Show the raw bytes around this area
  const byteIdx = Buffer.byteLength(text.substring(0, idx), 'utf8');
  console.log('Around "Vecur" at byte offset', byteIdx);
  const slice = buf.slice(byteIdx, byteIdx + 30);
  console.log('Hex:', slice.toString('hex'));
  console.log('UTF8:', slice.toString('utf8'));
  console.log('Latin1:', slice.toString('latin1'));
}

// Check the ORIGINAL part (first 33000 bytes should be OK from earlier fix)
const origText = buf.slice(0, 33000).toString('utf8');
console.log('\nOriginal section has Sódio?', origText.includes('Sódio'));
console.log('Original section has Potássio?', origText.includes('Potássio'));

// Check the NEW part
const newText = buf.slice(33000).toString('utf8');
console.log('\nNew section has ├│?', newText.includes('├│'));
console.log('New section has correct ó?', newText.includes('ó') && !newText.includes('├│'));

// Find the boundary between good and bad encoding
for (let i = 30000; i < 40000; i += 500) {
  const chunk = buf.slice(i, i+500).toString('utf8');
  if (chunk.includes('├')) {
    console.log('\nFirst ├ found around byte', i);
    // Find exact position
    for (let j = i; j < i + 500; j++) {
      const c = buf.slice(j, j+3).toString('utf8');
      if (c.startsWith('├')) {
        console.log('Exact byte:', j, 'hex:', buf.slice(j, j+4).toString('hex'));
        console.log('Context:', buf.slice(Math.max(0,j-20), j+20).toString('utf8'));
        break;
      }
    }
    break;
  }
}
