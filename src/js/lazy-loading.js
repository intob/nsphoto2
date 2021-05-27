export default function initLazyLoading() {
    const lazyItems = [].slice.call(document.querySelectorAll(".lazy"));

    const options = {
        threshold: 0.5
      }
  
    if (IntersectionObserver && lazyItems && lazyItems.length > 0) {
        const lazyItemsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.backgroundImage = `url(${entry.target.dataset.srcset})`;
                    entry.target.classList.remove('lazy');
                    lazyItemsObserver.unobserve(entry.target);
                }
            });
        }, options);
  
        lazyItems.forEach(lazyItem => {
        lazyItemsObserver.observe(lazyItem);
        });
    } else {
        lazyItems.forEach(lazyItem => {
            lazyItem.style.backgroundImage = `url(${lazyItem.dataset.srcset})`;
        });
    }
}