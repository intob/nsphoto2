import { keyTtl } from "./index";

export function store(data, mimeType, force = false) {
	return hash(data).then(hash => {
		const key = buildKey(hash, mimeType);

		let getCurrentValuePromise;
		if (force) {
			getCurrentValuePromise = Promise.resolve(null);
		} else {
			getCurrentValuePromise = MEDIA.get(key, {type:"arrayBuffer"});
		}

		return getCurrentValuePromise.then(currentValue => {
			if (!currentValue) {
				const options = {
					expirationTtl: keyTtl,
					metadata: {
						expires: Date.now() + keyTtl * 1000
					}
				};
				return MEDIA.put(key, data, options).then(() => key); 
			} else {
				return Promise.resolve(key);
			}
		});
	});
}

export function getKeyFromRequestUrl(requestUrl) {
	const [,type,subtype,hash] = new URL(requestUrl).pathname.split("/");
	return `${type}/${subtype}/${hash}`
}

export function getMimeTypeFromKey(key) {
	const [type, subtype,] = key.split("/");
	return `${type}/${subtype}`;
}

export function getMimeTypeFromRequest(request) {
	return request.headers.get("content-type");
}

function hash(arrayBuffer) {
	return crypto.subtle.digest('SHA-256', arrayBuffer);
}

function buildKey(hash, mimeType) {
	return `${mimeType}/${arrayBufferToHex(hash)}`
}

function arrayBufferToHex(arrayBuffer) {
	return [...new Uint8Array(arrayBuffer)]
		.map(x => x.toString(16).padStart(2, '0'))
		.join('');
}