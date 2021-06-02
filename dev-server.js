const path = require("path");
const express = require('express');
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const appPort = 3000;

const app = express();

app.use(connectLivereload());
app.use(express.static('dist'));

app.listen(appPort, () => {
    console.log(`DevServer: listening on localhost:${appPort}`);
});

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'dist'));

