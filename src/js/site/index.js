import '../../css/main.css';
import {ready, load} from './async';
import initMenu from './menu';
import initLazyLoading from './lazy-load';
import initHeroGridLoading from './hero-grid';
import initTagFilter from './tag-filter';


ready().then(() => {
  initMenu();
  initLazyLoading();
  initTagFilter();
});

load().then(() => {
  initHeroGridLoading();
});

window.addEventListener('resize', () => {
  window.requestAnimationFrame(() => {
    initHeroGridLoading();
  });
})