export default function supportsWebp() {
  if (!createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

  return new Promise(resolve => {
    fetch(webpData)
    .then(r => r.blob())
    .then(blob => {
      createImageBitmap(blob).then(() => resolve(true), () => resolve(false));
    });
  });
}