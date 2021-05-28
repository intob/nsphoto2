const tagSelector = "[data-tag]";
const mediaItemSelector = ".media-grid-item";

export default function initTagFilter() {
    filterDuplicates(document.querySelectorAll(tagSelector));

    const tagElements = document.querySelectorAll(tagSelector);
    tagElements.forEach(tagElement => {
        tagElement.removeAttribute('hidden');
        tagElement.addEventListener('click', () => {
            filterMedia(tagElement.dataset.tag)
            tagElements.forEach(t => t === tagElement ? t.classList.add('active') : t.classList.remove('active'));
        });
    });
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
        if (tag === '' || itemTags.indexOf(tag) > -1) {
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