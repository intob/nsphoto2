import ready from './ready';
import initMenu from './menu';
import initLazyLoading from './lazy-load';
import initTagFilter from './tag-filter';

ready().then(() => {
  initMenu();
  initLazyLoading();
  initTagFilter();
});
