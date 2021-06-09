export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(event.target.result);
    });
    reader.readAsArrayBuffer(file);
  });
}

export function processImage(data, file, progressHandler, maxWidth = undefined, quality = undefined) {
  const resizeOptions = maxWidth ? {withoutEnlargement: true, width: maxWidth} : undefined;

  let jpegOutputOptions = { mozjpeg: true };
  if (quality) {
    jpegOutputOptions.quality = quality;
  }
  const jpeg = optimizeImage(data, file.type, 'image/jpeg', resizeOptions, jpegOutputOptions)
    .then(data => {
      progressHandler(file, 16);
      return uploadData(data, file.type);
    });
  jpeg.then(() => progressHandler(file, 16));

  let webpOutputOptions = { reductionEffort: 6 };
  if (quality) {
    webpOutputOptions = quality;
  }
  const webp = optimizeImage(data, file.type, 'image/webp', resizeOptions, webpOutputOptions)
    .then(data => {
      progressHandler(file, 16);
      return uploadData(data, 'image/webp');
    });
  webp.then(() => progressHandler(file, 16));

  let avifOutputOptions = { speed: 5 };
  if (quality) {
    avifOutputOptions.quality = quality;
  }
  const avif = optimizeImage(data, file.type, 'image/avif', resizeOptions, avifOutputOptions)
    .then(data => {
      progressHandler(file, 16);
      return uploadData(data, 'image/avif');
    });
  avif.then(() => progressHandler(file, 16));

  return Promise.all([avif, webp, jpeg]);
}

function optimizeImage(data, contentType, targetType, resizeOptions = undefined, outputOptions = undefined) {
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
