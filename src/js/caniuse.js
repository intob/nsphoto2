export function supportsWebp() {
  return new Promise(resolve => {
    const webp = new Image();
    webp.addEventListener('error', () => resolve(false));
    webp.addEventListener('load', () => resolve(true));
    webp.src = 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';
  });
}

export function supportsAvif() {
  return new Promise(resolve => {
    const avif = new Image();
    avif.addEventListener('error', () => resolve(false));
    avif.addEventListener('load', () => resolve(true));
    avif.src = 'data:image/avif;base64,AAAAFGZ0eXBhdmlmAAAAAG1pZjEAAACgbWV0YQAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAC8AAAAGwAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAARWlwcnAAAAAoaXBjbwAAABRpc3BlAAAAAAAAAAQAAAAEAAAADGF2MUOBAAAAAAAAFWlwbWEAAAAAAAAAAQABAgECAAAAI21kYXQSAAoIP8R8hAQ0BUAyDWeeUy0JG+QAACANEkA=';
  });
}