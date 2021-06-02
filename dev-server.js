const express = require('express');
const app = express();

app.use(express.static('dist'));

app.listen(3000, () => {
    console.log('Listening on localhost:3000');
});