import glob from 'glob';
import colors from 'colors';
import path from 'path';
import webp from 'webp-converter';

webp.grant_permission();
glob('dist/**/*.+(jpg|png)', (e, images) => {
  Promise.all(images.map(img => processImage(img)))
    .then(() => {
      log('done');
    });
});

function processImage(src) {
  const out = src.replace(path.extname(src), '.webp');
  return webp.cwebp(src, out, "-preset photo -q 75 -m 5")
    .catch(e => error('failed to process', e))
}

function log(message) {
  console.log(colors.cyan('ImageMin:'), message);
}
function error(message, error) {
  console.error(colors.cyan('ImageMin:'), message, error);
}