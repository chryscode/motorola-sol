'use strict';

const express = require('express');

const getBooksRouter = require('./routes/books/getBooks');
const postBooksRouter = require('./routes/books/postBooks');

//iniitalize
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/books', getBooksRouter);
app.use('/books', postBooksRouter);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});