import glob from 'glob';
import colors from 'colors';
import path from 'path';
import webp from 'webp-converter';
import {stat} from 'fs/promises';

webp.grant_permission();
glob('dist/**/*.+(jpg|png)', (e, images) => {
  Promise.all(images.map(img => processImage(img)))
    .then(results => {
      let totalOriginal = 0;
      let totalSaving = 0
      results.forEach(result => {
        totalSaving += result.saving;
        totalOriginal += result.original;
      });
      log(`done, saved ${((totalSaving/totalOriginal)*100).toFixed(0)}% ${(totalSaving/1000000).toFixed(2)}MB`);
    });
});

function processImage(src) {
  const out = src.replace(path.extname(src), '.webp');
  return webp.cwebp(src, out, "-preset photo -q 75 -m 5")
    .catch(e => error('failed to process', e))
    .then(() => {
      return Promise.all([getSize(src), getSize(out)])
        .then(values => { 
          return {
            original: values[0],
            saving: values[0] - values[1]
          };
        });
    });
}

function getSize(file) {
  return stat(file).then(stats => stats.size);
}

function log(message) {
  console.log(colors.cyan('ImageMin:'), message);
}
function error(message, error) {
  console.error(colors.cyan('ImageMin:'), message, error);
}