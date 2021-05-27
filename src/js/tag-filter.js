const tagSelector = "[data-tag]";
const clearFilterSelector = "[data-filter-clear]";
const mediaItemSelector = ".media-grid-item";

export default function initTagFilter() {
    filterDuplicates(document.querySelectorAll(tagSelector));

    document.querySelectorAll(tagSelector).forEach(tagElement => {
        tagElement.addEventListener('click', () => filterMedia(tagElement.dataset.tag));
    });

    document.querySelectorAll(clearFilterSelector).forEach(clearFilterElement => {
        clearFilterElement.addEventListener('click', () => clearFilter());
    })
}

function filterDuplicates(tagElements) {
    let seen = {};
    tagElements.forEach(tagElement => {
        seen.hasOwnProperty(tagElement.dataset.tag) ? tagElement.remove() : seen[tagElement.dataset.tag] = true;
    });
}

function filterMedia(tag) {
    document.querySelectorAll(mediaItemSelector).forEach(item => {
        const itemTags = getTags(item.dataset.tags);
        if (itemTags.indexOf(tag) > -1) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function getTags(tagList) {
    return tagList.split(',')
        .filter(tag => tag.length > 0);
}

function clearFilter() {
    document.querySelectorAll(mediaItemSelector).forEach(item => item.classList.remove('hidden'));
}