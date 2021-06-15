import express from 'express';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import colors from 'colors';
import path from 'path';

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.resolve('dist'));

const appPort = 3000;

const app = express();

app.use(connectLivereload());
app.use(express.static('dist'));

app.listen(appPort, () => {
	log(`listening on localhost:${appPort}`);
});

function log(message) {
	console.log(colors.green('DevServer:'), message);
}