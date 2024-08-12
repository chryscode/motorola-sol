const api = require('./api');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./books-catalogue.db', (err) => {
    if (err) {
        console.error('Error on creating the database.', err.message);
    }
    console.log('Connected to the database.');
});

//Create Table
async function createTable(tableName, sqlCreateStmt){
    return new Promise((resolve, reject) => {
        db.get(`SELECT name FROM sqlite_master WHERE type = "table" AND name = ?`, tableName, (err, row) => {
            if (err) {
                console.error('Error on determining if the table exists: ', err);
                reject(err);
            } else if (row) {
                console.log(`${tableName} table already exists.`);
                resolve();
            } else {
                console.log(`Creating ${tableName} table...`);
                db.run(sqlCreateStmt , (err) => {
                    if (err) {
                        console.error('Error on table creation', err);
                        reject(err);
                    } else {
                        console.log(`${tableName} table created successfully.`);
                        if(tableName === "authors") {
                            addAuthor();
                        } else {
                            addBooks();
                        }
                        resolve();
                    }
                });
            }
        });
    })
}

//Calling external Library & adding to the authors
async function addAuthor(){
    try{
        const authors = await api.fetchFromAPI('https://freetestapi.com/api/v1/authors');

        //Loop through the authors
        authors.forEach(author => {
            const { name, birth_year, biography } = author;
            db.run('INSERT INTO authors (name, birth_year, biography) VALUES (?, ?, ?)', [name, birth_year, biography], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Author inserted successfully.');
                }
            });
        });
    } catch (error) {
        console.log('Error on populating the authors table. ', error);
    }           
}

//Calling external Library & adding to the books
async function addBooks(){
    try{
        const books = await api.fetchFromAPI('https://freetestapi.com/api/v1/books');
        //Loop through the authors
        books.forEach(book => {
            const { title, author, publication_year, description } = book;

            //Get the author_id from the authors table
            db.get('SELECT id FROM authors WHERE name = ?', author, (err, row) => {
                if (err) {
                    console.error(err);
                } else if (!row) {
                    console.error('Author not found');
                } else {
                    const author_id = row.id;
                    db.run('INSERT INTO books (title, author_id, publication_year, description) VALUES (?, ?, ?, ?)', [title, author_id, publication_year, description], (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('Book inserted successfully.');
                        };
                    });
                }
            });
        });
    } catch(error){
        console.log( { error: error } );
    }
}

async function dbSetUp(){   
    const authorsSqlCreateStmt = `
    CREATE TABLE authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birth_year INTEGER,
        biography TEXT
    )`;

    const booksSqlCreateStmt = `
    CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        publication_year INTEGER,
        description TEXT,
        FOREIGN KEY (author_id) REFERENCES authors(id)
    )`;

    try{
        await createTable('authors', authorsSqlCreateStmt);
        await createTable('books', booksSqlCreateStmt);
    } catch(error){
        console.log(error);
    }
}

async function selectTable(tableName){
    return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM ${tableName}`;
        db.all(selectQuery, (err, rows) => {
            if (err) {
                console.log('Error on SELECT. ', err.message);
                reject(err);
            }
            resolve(rows);
        });
    });
}

dbSetUp();

//Call in the functions to 
module.exports = {
    selectTable
}

