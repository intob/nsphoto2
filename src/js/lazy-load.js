import supportsWebp from './webp';

export default function initLazyLoading() {
  supportsWebp().then(webpEnabled => {
    const lazyItems = [...document.querySelectorAll('[data-lazy]')];

    const observerOptions = {
      threshold: 0.3
    };

    if (IntersectionObserver && lazyItems && lazyItems.length > 0) {
      const lazyItemsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target;
            if (item.tagName === 'IMG') {
              item.src = webpEnabled && item.dataset.srcsetWebp ? item.dataset.srcsetWebp : item.dataset.srcset;
            } else {
              item.removeAttribute('data-lazy');
              item.style.backgroundImage = `url(${webpEnabled && item.dataset.srcsetWebp ? item.dataset.srcsetWebp : item.dataset.srcset})`;
            }
            lazyItemsObserver.unobserve(item);
          }
        });
      }, observerOptions);

      lazyItems.forEach(lazyItem => {
        lazyItemsObserver.observe(lazyItem);
      });
    }
    });
  
}
