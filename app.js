'use strict';

const express = require('express');
//const db = require('./db');
const booksRouter = require('./routes/books');

//iniitalize
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/books', booksRouter);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});