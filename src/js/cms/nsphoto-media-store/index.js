import MediaStoreWidget from './widget';

async function init({handleInsert}) {
  const mediaStoreWidget = new MediaStoreWidget({handleInsert});
  return {
    show: () => mediaStoreWidget.handleShow(),
    hide: () => mediaStoreWidget.handleHide(),
    enableStandalone: () => false,
  };
}

const NSPhotoMediaStore = { name: 'nsphoto-media-store', init };

export default NSPhotoMediaStore;
