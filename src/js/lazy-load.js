export default function initLazyLoading() {
  const lazyItems = [...document.querySelectorAll('.lazy, img[data-srcset]')];

  const options = {
    threshold: 0.3
  };

  if (IntersectionObserver && lazyItems && lazyItems.length > 0) {
    const lazyItemsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          if (item.tagName === 'IMG') {
            item.src = item.dataset.srcset;
          } else {
            item.classList.remove('lazy');
            item.style.backgroundImage = `url(${item.dataset.srcset})`;
          }
          lazyItemsObserver.unobserve(item);
        }
      });
    }, options);

    lazyItems.forEach(lazyItem => {
      lazyItemsObserver.observe(lazyItem);
    });
  } else {
    lazyItems.forEach(lazyItem => {
      if (lazyItem.tagName === 'img') {
        lazyItem.src = lazyItem.dataset.srcset;
      } else {
        lazyItem.style.backgroundImage = `url(${lazyItem.dataset.srcset})`;
      }

    });
  }
}
