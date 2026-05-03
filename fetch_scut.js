const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  await download('https://raw.githubusercontent.com/carlosrenatoy/medicamentos/a3a4c9481272c59228264fa96123b8ed6768c20a/ipass-scut/index.html', 'temp_index.html');
  await download('https://raw.githubusercontent.com/carlosrenatoy/medicamentos/a3a4c9481272c59228264fa96123b8ed6768c20a/ipass-scut/js/app.js', 'temp_app.js');
  console.log('Downloaded!');
})();
