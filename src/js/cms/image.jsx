const IMGIN = "//imgin.fly.dev"
const IMGIN_SECRET = "gy9amurwhso9px2mppnc"

export function readFile(file) {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.addEventListener('load', (event) => {
			resolve(event.target.result);
		});
		reader.readAsArrayBuffer(file);
	});
}

export function processImage(data, progressHandler, fileName, contentType, width, height) {
	const jpeg = optimizeImage(data, contentType, 'jpeg', width, height)
		.then(data => {
			progressHandler(fileName, 16);
			return uploadData(data, "image/jpeg");
		});
	jpeg.then(() => progressHandler(fileName, 16));

	const webp = optimizeImage(data, contentType, 'webp', width, height)
		.then(data => {
			progressHandler(fileName, 16);
			return uploadData(data, 'image/webp');
		});
	webp.then(() => progressHandler(fileName, 16));

	return Promise.all([webp, jpeg]);
}

function optimizeImage(data, contentType, format, width, height) {
	const headers = {
		'content-length': data.byteLength,
		'content-type': contentType,
		'authorization': IMGIN_SECRET
	}
	const params = new URLSearchParams()
	params.set("format", format)
	if (width) {
		params.set("width", width)
	}
	if (height) {
		params.set("height", height)
	}

	return fetch(`${IMGIN}?${params.toString()}`, {
		method: 'POST',
		headers: headers,
		body: data
	})
		.then(response => response.arrayBuffer());
}

function uploadData(data, contentType) {
	return fetch('https://media-store.intob.workers.dev/', {
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
