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

  let inputStream = sharp(src);

  if (path.dirname(src) !== 'dist/en' && path.dirname(src) !== 'dist/de') {
    inputStream = inputStream.resize(750);
  }

  const webpPromise = inputStream.clone()
    .toFile(outWebp)
    .catch(err => error(err))

  const avifPromise = inputStream.clone()
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