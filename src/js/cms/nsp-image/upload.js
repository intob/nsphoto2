export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(event.target.result);
    });
  reader.readAsArrayBuffer(file);
  });
}

export function processImage(data) {
  const original = uploadData(data, "image/jpeg"); // original

  const webp = optimizeImage(data, "image/jpeg", "image/webp")
    .then(data => uploadData(data, "image/webp"));

  const avif = optimizeImage(data, "image/jpeg", "image/avif", { speed: 8 })
    .then(data => uploadData(data, "image/avif"));

  return Promise.all([avif, webp, original]);
}

function optimizeImage(data, contentType, targetType, options = {}) {
  return fetch("https://joeynici.synology.me:3002/", {
    method: "POST",
    headers: {
      "content-type": contentType,
      "accept": targetType,
      "options": JSON.stringify(options)
    },
    body: data
  })
  .then(response => response.arrayBuffer());
}

function uploadData(data, contentType) {
  return fetch("https://nsphoto-media-store.dr-useless.workers.dev/", {
    method: "PUT",
    headers: {
      "authorization": getAuthToken(),
      "content-type": contentType
    },
    body: data
  })
  .then(response => response.text());
}

function getAuthToken() {
  return `Bearer ${JSON.parse(localStorage.getItem("netlify-cms-user")).token}`;
}

