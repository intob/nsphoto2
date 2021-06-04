export default function initLazyLoading() {
  const lazyItems = [...document.querySelectorAll('picture')];

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
        lazyItemsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  lazyItems.forEach(lazyItem => {
    lazyItemsObserver.observe(lazyItem);
  });
}