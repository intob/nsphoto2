export default function supportsWebp() {
  return new Promise(resolve => {
    var webp = new Image();
    webp.addEventListener('error', () => {
      resolve(false);
    });
    webp.addEventListener('load', () => {
      resolve(true);
    });
    webp.src = 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';
  });
}