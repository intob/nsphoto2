export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(event.target.result);
    });
  reader.readAsArrayBuffer(file);
  });
}

export function processImage(data, type, maxWidth = undefined) {
  const resizeOptions = maxWidth ? { withoutEnlargement: true, width: maxWidth } : undefined;

  const jpeg = optimizeImage(data, type, "image/jpeg", resizeOptions, { mozjpeg: true })
  .then(data => uploadData(data, type));

  const webp = optimizeImage(data, type, "image/webp", resizeOptions, { reductionEffort: 6 })
    .then(data => uploadData(data, "image/webp"));

  const avif = optimizeImage(data, type, "image/avif", resizeOptions, { speed: 8 })
    .then(data => uploadData(data, "image/avif"));

  return Promise.all([avif, webp, jpeg]);
}

function optimizeImage(data, contentType, targetType, resizeOptions = undefined, outputOptions = undefined) {
  let headers = {
    "content-length": data.byteLength,
    "content-type": contentType,
    "accept": targetType
  }
  if (outputOptions) {
    headers["output-options"] = JSON.stringify(outputOptions);
  }
  if (resizeOptions) {
    headers["resize-options"] = JSON.stringify(resizeOptions)
  }
  return fetch("https://joeynici.synology.me:3002/", {
    method: "POST",
    headers: headers,
    body: data
  })
  .then(response => response.arrayBuffer());
}

function uploadData(data, contentType) {
  return fetch("https://nsphoto-media-store.dr-useless.workers.dev/", {
    method: "PUT",
    headers: {
      "authorization": getAuthToken(),
      "content-type": contentType,
      "content-length": data.byteLength
    },
    body: data
  })
  .then(response => response.text());
}

function getAuthToken() {
  return `Bearer ${JSON.parse(localStorage.getItem("netlify-cms-user")).token}`;
}

