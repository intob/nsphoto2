import {supportsAvif, supportsWebp} from './caniuse';

export default function initLazyLoading() {
  const observerOptions = {
    threshold: 0.3
  };

  const lazyImages = [...document.querySelectorAll('picture[data-lazy]')];
  const lazyImageObserver = getLazyImageObserver(observerOptions);
  lazyImages.forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage.parentElement);
  });

  const lazyIframes = [...document.querySelectorAll('iframe[data-lazy]')];
  const lazyIframeObserver = getLazyIframeObserver(observerOptions);
  lazyIframes.forEach(lazyIframe => {
    lazyIframeObserver.observe(lazyIframe);
  });

  const lazyBackgrounds = [...document.querySelectorAll('[data-lazy-bg]')];
  const lazyBackgroundObserver = getLazyBackgroundObserver(observerOptions);
  lazyBackgrounds.forEach(lazyBackground => {
    lazyBackgroundObserver.observe(lazyBackground);
  });

}

function getLazyImageObserver(options) {
  const intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target.querySelector('[data-lazy]');
        [...lazyImage.querySelectorAll('[data-srcset]')].forEach(source => {
          source.srcset = source.dataset.srcset;
          if (source.tagName === 'IMG') {
            source.addEventListener('load', () => {
              lazyImage.removeAttribute('data-lazy');
            });
          }
        });
        intersectionObserver.unobserve(entry.target);
      }
    });
  }, options);
  return intersectionObserver;
}

function getLazyIframeObserver(options) {
  const intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.srcsetIframe;
        entry.target.addEventListener('load', () => {
          entry.target.removeAttribute('data-lazy');
        });
        intersectionObserver.unobserve(entry.target);
      }
    });
  }, options);
  return intersectionObserver;
}

function getLazyBackgroundObserver(options) {
  const intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        Promise.all([supportsAvif(), supportsWebp()])
          .then(([supportsAvif, supportsWebp]) => {
            item.removeAttribute('data-lazy-bg');
            if (supportsAvif) {
              item.style.backgroundImage = `url(${item.dataset.srcsetAvif})`;
              return;
            }
            if (supportsWebp) {
              item.style.backgroundImage = `url(${item.dataset.srcsetWebp})`;
              return;
            }
            item.style.backgroundImage = `url(${item.dataset.srcsetJpeg})`;
          });
        intersectionObserver.unobserve(entry.target);
      }
    });
  }, options);
  return intersectionObserver;
}
