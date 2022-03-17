import path from 'path';
import fs from 'fs';
import https from 'https';

const imageRegex = /https:\/\/media-store.intob.workers.dev\/image\/\w+\/\w+/g;

function recFindByExt(base,ext,files,result) {
	files = files || fs.readdirSync(base);
	result = result || [];
	files.forEach(file => {
		let newbase = path.join(base,file)
		if (fs.statSync(newbase).isDirectory()) {
			result = recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
		} else if ( file.substr(-1*(ext.length+1)) === `.${ext}`) {
			result.push(newbase);
		}
	});
	return result;
}

function makeRequest(link) {
	return new Promise((resolve, reject) => {
		const url = new URL(link);
		const req = https.get(url, res => {
			const output = `${url.pathname} ${res.statusCode}`;
			console.log(output);
			resolve(output);
		});
		req.on('error', error => {
			reject(error);
		});
		req.end();
	});
}

const contentFiles = recFindByExt('./site/content','md');

const promises = [];

console.log(`Found ${contentFiles.length} files`);

contentFiles.forEach(contentFile => {
	const content = fs.readFileSync(contentFile, {encoding: 'utf-8'});
	const search = [...content.matchAll(imageRegex)];
	const images = search.map(hit => hit[0]);
	promises.push(...images.map(image => makeRequest(image)));
});

console.log(`${promises.length} images to get`);

Promise.allSettled(promises)
.then(() => console.log('Done'));