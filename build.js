const esbuild = require('esbuild');

let buildPromises = [];

const cmsBuild = esbuild.build({
  entryPoints: ['./src/js/cms.tsx'],
  bundle: true,
  minify: !isDev(),
  watch: watch(),
  outfile: './dist/cms.js',
}).catch(() => process.exit(1));
buildPromises.push(cmsBuild);

const contactBuild = esbuild.build({
  entryPoints: ['./src/js/contact.js'],
  bundle: true,
  minify: !isDev(),
  watch: watch(),
  outfile: './dist/contact.js',
}).catch(() => process.exit(1));
buildPromises.push(contactBuild);

const mainBuild = esbuild.build({
  entryPoints: ['./src/js/index.js'],
  bundle: true,
  minify: !isDev(),
  watch: watch(),
  outfile: './dist/index.js',
}).catch(() => process.exit(1));
buildPromises.push(mainBuild);

Promise.all(buildPromises).then(() => console.log("ESBuild: done"));

function watch() {
  if (isDev()) {
    return {
      onRebuild(error, result) {
        if (error) {
          console.error('ESBuild: watch build failed:', error)
        } else {
          console.log('ESBuild: watch build succeeded:', result)
        }
      }
    }
  }
  return false;
}

function isDev() {
  return process.argv.indexOf('--dev') >= 0;
}