export default function initLazyLoading() {
  const lazyItems = [...document.querySelectorAll('[data-lazy]')];

  const observerOptions = {
    threshold: 0.3
  };

  const lazyItemsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.removeAttribute('data-lazy');
        [...entry.target.querySelectorAll('[data-srcset]')].forEach(source => {
          source.srcset = source.dataset.srcset;
          source.removeAttribute('data-srcset');
        });
        [...entry.target.querySelectorAll('[data-srcset-iframe]')].forEach(source => {
          source.src = source.dataset.srcsetIframe;
          source.removeAttribute('data-srcset-iframe');
        });
        lazyItemsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  lazyItems.forEach(lazyItem => {
    lazyItemsObserver.observe(lazyItem);
  });
}