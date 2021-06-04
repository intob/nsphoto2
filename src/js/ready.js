export default function ready() {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  } else {
    return new Promise(resolve => {
      window.addEventListener('DOMContentLoaded', () => resolve());
    });
  }
}
