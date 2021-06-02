import './css/main.css';
import initLazyLoading from './js/lazy-load';
import initMenu from './js/menu';
import initTagFilter from './js/tag-filter';
import initContactForm from './js/contact';


window.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initLazyLoading();
  initTagFilter();
  initContactForm();
});
