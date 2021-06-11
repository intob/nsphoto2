import '../../css/main.css';
import {ready} from './async';
import initMenu from './menu';
import initLazyLoading from './lazy-load';
import initTagFilter from './tag-filter';

ready().then(() => {
	initMenu();
	initLazyLoading();
	initTagFilter();
});
