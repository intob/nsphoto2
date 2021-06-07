export function store(data, mimeType) {
  return hash(data).then(hash => {
    const key = buildKey(hash, mimeType);
    return MEDIA.put(key, data).then(() => key);
  });
}

export function getKeyFromRequestUrl(requestUrl) {
  return new URL(requestUrl).pathname.replace("/", "");
}

export function getMimeTypeFromKey(key) {
  return key.split(":")[1];
}

export function getMimeTypeFromRequest(request) {
  return request.headers.get("content-type");
}

function hash(arrayBuffer) {
  return crypto.subtle.digest('SHA-256', arrayBuffer);
}

function buildKey(hash, mimeType) {
  return `${arrayBufferToHex(hash)}:${mimeType}`
}

function arrayBufferToHex(arrayBuffer) {
  return [...new Uint8Array(arrayBuffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}