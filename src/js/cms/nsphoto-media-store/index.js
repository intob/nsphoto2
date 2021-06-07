import MediaStoreWidget from './widget';

async function init() {
  const mediaStoreWidget = new MediaStoreWidget();
  return {
    show: () => mediaStoreWidget.handleShow(),
    hide: () => mediaStoreWidget.handleHide(),
    enableStandalone: () => false,
  };
}

const NSPhotoMediaStore = { name: 'nsphoto-media-store', init };

export default NSPhotoMediaStore;
