export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(event.target.result);
    });
    reader.readAsArrayBuffer(file);
  });
}

export function processImage(data, file, progressHandler, width = undefined, height = undefined, fit = undefined, quality = undefined) {
  const resizeOptions = width || height ? {width: width, height: height, fit: fit, withoutEnlargement: true,} : undefined;

  const jpeg = optimizeImage(data, file.type, 'image/jpeg', resizeOptions, { mozjpeg: true, quality: quality })
    .then(data => {
      progressHandler(file, 16);
      return uploadData(data, file.type);
    });
  jpeg.then(() => progressHandler(file, 16));

  const webp = optimizeImage(data, file.type, 'image/webp', resizeOptions, { reductionEffort: 6, quality: quality })
    .then(data => {
      progressHandler(file, 16);
      return uploadData(data, 'image/webp');
    });
  webp.then(() => progressHandler(file, 16));

  const avif = optimizeImage(data, file.type, 'image/avif', resizeOptions, { speed: 5, quality: quality })
    .then(data => {
      progressHandler(file, 16);
      return uploadData(data, 'image/avif');
    });
  avif.then(() => progressHandler(file, 16));

  return Promise.all([avif, webp, jpeg]);
}

function optimizeImage(data, contentType, targetType, resizeOptions, outputOptions) {
  const headers = {
    'content-length': data.byteLength,
    'content-type': contentType,
    'accept': targetType
  };
  if (outputOptions) {
    headers['output-options'] = JSON.stringify(outputOptions);
  }
  if (resizeOptions) {
    headers['resize-options'] = JSON.stringify(resizeOptions);
  }
  return fetch('https://joeynici.synology.me:3002/', {
    method: 'POST',
    headers: headers,
    body: data
  })
    .then(response => response.arrayBuffer());
}

function uploadData(data, contentType) {
  return fetch('https://nsphoto-media-store.dr-useless.workers.dev/', {
    method: 'PUT',
    headers: {
      'authorization': getAuthToken(),
      'content-type': contentType,
      'content-length': data.byteLength
    },
    body: data
  })
    .then(response => response.text());
}

function getAuthToken() {
  return `Bearer ${JSON.parse(localStorage.getItem('netlify-cms-user')).token}`;
}
