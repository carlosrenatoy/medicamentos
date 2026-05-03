import https from 'https';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://raw.githubusercontent.com/carlosrenatoy/medicamentos/a3a4c9481272c59228264fa96123b8ed6768c20a/ipass-scut/';

const files = [
  'index.html',
  'mapa-retaguarda.html',
  'css/styles.css',
  'css/buxo-styles.css',
  'css/final-view.css',
  'js/final-app.js',
  'js/mapa-retaguarda-app.js',
  'assets/logo-icr.png'
];

function download(relativeUrl: string) {
  const url = baseUrl + relativeUrl;
  const dest = path.join(process.cwd(), 'public', 'ipass-scut', relativeUrl);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  
  return new Promise<void>((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        if (relativeUrl.includes('logo')) return resolve();
        return reject(new Error('Status ' + res.statusCode + ' ' + url));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  for (const f of files) {
    console.log('Downloading ' + f);
    await download(f);
  }
  console.log('Done!');
})();
