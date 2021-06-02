import '../css/main.css';
import initLazyLoading from './lazy-load';
import initMenu from './menu';
import initTagFilter from './tag-filter';
import initContactForm from './contact';

window.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initLazyLoading();
  initTagFilter();
  initContactForm();
});
