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

async function getAutorIdByName(name){
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM authors WHERE name = ?', name, (err, rows) => {
            if (err) {
                console.error('Error on trying to retrive id from authors. ', err.message);
                reject(err);
            } 
            if(rows) resolve(rows.id);
            resolve();
        });
    })
}
// Insert book data
async function insertBook(bookData) {
    const { title, author, publication_year, description } = bookData;
    
    //Check if author exists
    const author_id = await getAutorIdByName(author);
    if (!author_id || author_id == undefined) {
        return(`Author ${author} not found.`);
    }

    const sql = 'INSERT INTO books (title, author_id, publication_year, description) VALUES (?, ?, ?, ?)';
    try {
      db.run(sql, [title, author_id, publication_year, description]);
      return(`Book ${title} inserted successfully.`);
    } catch (error) {
      console.error('Error inserting book:', error.message);
      throw error; // Re-throw for potential handling at call site
    }
}

async function insertAuthor(authorData) {
    
    const { name, birth_year, biography } = authorData;

    const sql = 'INSERT INTO authors (name, birth_year, biography) VALUES (?, ?, ?)';
    try {
      db.run(sql, [name, birth_year, biography]);
      return(`Author ${name} inserted successfully.`);
    } catch (error) {
      console.error('Error inserting author:', error.message);
      throw error;
    }
}

//delete author
async function deleteAuthor(id){
    try{
       // Check if the author exists
        const author = db.get('SELECT * FROM authors WHERE id = ?', [id]);
        if (!author) {
            return 'No author found with the provided ID.';
        }

        // Delete the author
        db.run('DELETE FROM authors WHERE id = ?', [id]);
        console.log(`Author (ID: ${id}) deleted successfully.`);

        // Delete associated books
        db.run('DELETE FROM books WHERE author_id = ?', [id]);
        console.log('Associated books deleted successfully.');

        const message = `Author (ID: ${id}) and associated books deleted successfully.`
        return message;
    } catch(error){
        console.error('Error deleting  author:', error.message);
        throw error;
    }
}

//delete author
async function deleteBook(id){
    try{
       // Check if the book exists
        const book = db.get('SELECT * FROM books WHERE id = ?', [id]);
        if (!book || book == undefined) {
            return 'No book found with the provided ID.';
        }

        // Delete associated books
        db.run('DELETE FROM books WHERE id = ?', [id]);        
        const message = `Book (ID: ${id}) deleted successfully.`;

        return message;
    } catch(error){
        console.error('Error deleting book:', error.message);
        throw error;
    }
}

//Update books
async function updateBook(bookData){
    const { id, title, author, publication_year, description } = bookData;
    try{
        //check if the book exists
        const existingBook = db.get('SELECT * FROM books WHERE id = ?', [id]);
        if (!existingBook) {
            return 'No book found with the provided ID.';
        }

        //Get Author Id
        const author_id = await getAutorIdByName(author);

        //update the books
        db.run('UPDATE books SET title = ?, author_id = ?, publication_year = ?, description = ? WHERE id = ?', [title, author_id, publication_year, description, id]);
        const message = `Book (ID: ${id}) updated successfully.`;

        return message;
    } catch(error){
        console.error('Error updating book:', error.message);
        throw error;
    }           
}

//Update author
async function updateAuthor(authorData){
    const { id, name, birth_year, biography } = authorData;
    try{
        //check if the book exists
        const existingAuthor = db.get('SELECT * FROM authors WHERE id = ?', [id]);
        if (!existingAuthor) {
            return 'No author found with the provided ID.';
        }

        //update the books
        db.run('UPDATE authors SET name = ?, birth_year = ?, biography = ? WHERE id = ?', [name, birth_year, biography, id]);
        const message = `Author (ID: ${id}) updated successfully.`;

        return message;
    } catch(error){
        console.error('Error updating author:', error.message);
        throw error;
    }           
}

//Calling external Library & adding to the authors
async function addAuthor(){
    try{
        const authors = await api.fetchFromAPI('https://freetestapi.com/api/v1/authors');

        //Loop through the authors
        authors.forEach(async(author) => {
            const message = await insertAuthor(author);
            console.log(message);
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
        books.forEach(async book => {                        
            const message = await insertBook(book);
            console.log(message);
        });
    } catch(error){
        console.log('Error on adding into books', error);
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

async function selectAuthors(){
    return new Promise((resolve, reject) => {
        let selectQuery = `SELECT * FROM authors`;
        db.all(selectQuery, (err, rows) => {
            if (err) {
                console.log('Error on SELECT. ', err.message);
                reject(err);
            }
            resolve(rows);
        });
    });
}

async function selectBooks(){
    return new Promise((resolve, reject) => {
        const selectQuery = `SELECT b.id, b.title, b.publication_year, b.description, a.name, a.birth_year, a.biography FROM books b inner join authors a on b.author_id = a.id`;
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
    selectAuthors,
    selectBooks,
    getAutorIdByName,
    insertBook,
    insertAuthor,
    deleteAuthor,
    deleteBook,
    updateBook,
    updateAuthor
}

