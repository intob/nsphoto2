import "./css/main.css";
import initLazyLoading from "./js/lazy-loading";
import initMenu from "./js/menu";
import initTagFilter from "./js/tag-filter"


window.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initLazyLoading();
    initTagFilter();
});