'use strict';

const express = require('express');

const pingRouter = require('./routes/ping');

//iniitalize
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/ping', pingRouter);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});