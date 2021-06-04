export default function initLazyLoading() {
  const lazyImages = [...document.querySelectorAll('picture[data-lazy]')];
  const lazyIframes = [...document.querySelectorAll('iframe[data-lazy]')];

  const observerOptions = {
    threshold: 0.3
  };

  const lazyImageObserver = getLazyImageObserver(observerOptions);
  lazyImages.forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage.parentElement);
  });

  const lazyIframeObserver = getLazyIframeObserver(observerOptions);
  lazyIframes.forEach(lazyIframe => {
    lazyIframeObserver.observe(lazyIframe);
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
        console.log('iframe!');
        entry.target.addEventListener('load', () => {
          console.log('loaded');
          entry.target.removeAttribute('data-lazy');
        });
        intersectionObserver.unobserve(entry.target);
      }
    });
  }, options);
  return intersectionObserver;
}