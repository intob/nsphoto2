import express from 'express';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import colors from 'colors';

const appPort = 3000;

const app = express();

app.use(connectLivereload());
app.use(express.static('dist'));

app.listen(appPort, () => {
  log(`listening on localhost:${appPort}`);
});

const liveReloadServer = livereload.createServer();
liveReloadServer.watch('dist');

function log(message) {
  console.log(colors.green('DevServer:'), message);
}