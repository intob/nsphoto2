import esbuild from 'esbuild';

esbuild.build({
	entryPoints: ['./src/index.js'],
	bundle: true,
	minify: true,
	outfile: './dist/index.js',
}).catch(() => process.exit(1))
	.then(() => console.log('ESBuild: done'));