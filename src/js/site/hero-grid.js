export default function initHeroGridLoading() {
  const heroImages = [...document.querySelectorAll('.hero-grid-item')]
    .filter(item => item.querySelector('picture[data-super-lazy]') && getComputedStyle(item).display !== 'none')
    .map(item => item.querySelector('picture[data-super-lazy]'));
  if(heroImages.length > 0) {
    loadRandomImage(heroImages);
  }
}

function loadRandomImage(images) {
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];
  images.splice(index, 1);
  [...image.querySelectorAll('[data-srcset]')].forEach(source => {
    source.srcset = source.dataset.srcset;
    if (source.tagName === 'IMG') {
      source.addEventListener('load', () => {
        image.removeAttribute('data-super-lazy');
        if (images.length > 0) {
          loadRandomImage(images);
        }
      });
    }
  });
}