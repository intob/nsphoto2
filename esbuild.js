import esbuild from 'esbuild';
import colors from 'colors';

let buildPromises = [];

const cmsBuild = esbuild.build({
	entryPoints: ['./src/js/cms/index.jsx'],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: './dist/cms.js',
}).catch(() => process.exit(1));
buildPromises.push(cmsBuild);

const cmsPreviewStylesBuild = esbuild.build({
	entryPoints: ['./src/js/cms/preview/styles.css'],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: './dist/cms-preview-styles.css',
}).catch(() => process.exit(1));
buildPromises.push(cmsPreviewStylesBuild);

const contactBuild = esbuild.build({
	entryPoints: ['./src/js/site/contact.js'],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: './dist/contact.js',
}).catch(() => process.exit(1));
buildPromises.push(contactBuild);

const mainBuild = esbuild.build({
	entryPoints: ['./src/js/site/index.js'],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: './dist/index.js',
}).catch(() => process.exit(1));
buildPromises.push(mainBuild);

const heroBuild = esbuild.build({
	entryPoints: ['./src/js/site/hero.js'],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: './dist/hero.js',
}).catch(() => process.exit(1));
buildPromises.push(heroBuild);

Promise.all(buildPromises).then(() => log('done'));

function watch() {
	if (isDev()) {
		return {
			onRebuild(e) {
				if (e) {
					error('watch build failed', e)
				} else {
					log('watch build succeeded')
				}
			}
		}
	}
	return false;
}

function isDev() {
	return process.argv.indexOf('--dev') >= 0;
}

function log(message) {
	console.log(colors.magenta('ESBuild:'), message);
}
function error(message, error) {
	console.error(colors.magenta('ESBuild:'), message, error);
}
