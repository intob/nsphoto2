function showMediaLibrary() {
  console.log('show media library');  
}

function hideMediaLibrary() {
  console.log('hide media library');
}

async function init() {
  return {
    show: () => showMediaLibrary(),
    hide: () => hideMediaLibrary(),
    enableStandalone: () => false,
  };
}

const NSPhotoMediaLibrary = { name: 'nsphoto-media-library', init };

export default NSPhotoMediaLibrary;
