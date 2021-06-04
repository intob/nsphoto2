import glob from 'glob';
import colors from 'colors';
import path from 'path';
import sharp from 'sharp';

glob('dist/**/*.+(jpg|png)', (e, images) => {
  Promise.all(images.map(img => processImage(img)))
    .then(() => log('done'));
});

function processImage(src) {
  const outWebp = src.replace(path.extname(src), '.webp');
  const outAvif = src.replace(path.extname(src), '.avif');

  const webpPromise = sharp(src)
    .toFile(outWebp)
    .catch(err => error(err))

  const avifPromise = sharp(src)
    .toFile(outAvif)
    .catch(err => error(err))

  return Promise.allSettled([webpPromise, avifPromise])
}

function log(message) {
  console.log(colors.cyan('ImageMin:'), message);
}
function error(message, error) {
  console.error(colors.cyan('ImageMin:'), message, error);
}