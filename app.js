'use strict';

const express = require('express');

const getBooksRouter = require('./routes/books/getBooks');
const postBooksRouter = require('./routes/books/postBooks');

const getAuthorRouter = require('./routes/author/getAuthor');
const postAuthorRouter = require('./routes/author/postAuthor');

//iniitalize
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/books', getBooksRouter);
app.use('/books', postBooksRouter);

app.use('/authors', getAuthorRouter);
app.use('/authors', postAuthorRouter);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});


