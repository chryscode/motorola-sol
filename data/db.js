const https = require('https');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./books-catalogue.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

//Create the books table and populate this from an external api
db.get('SELECT name FROM sqlite_master WHERE type = "table" AND name = "books"', (err, row) => {
    if (err) {
        console.error(err);
    } else if (row) {
        console.log('Books table already exists.');
    } else {
        console.log('Creating books table...');
        db.run(`
            CREATE TABLE books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                first_publish_year INTEGER
            )` , (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Books table created successfully.');
                
                //Add Books
                addBooks('Dracula');
                addBooks('Pride And Prejudice');
                addBooks('Sense And Sensibility');
                addBooks('Harry Potter');


            }
        });
    }
});

//Create the authors table and populate this from an external api
db.get('SELECT name FROM sqlite_master WHERE type = "table" AND name = "authors"', (err, row) => {
    if (err) {
        console.error(err);
    } else if (row) {
        console.log('Authors table already exists.');
    } else {
        console.log('Creating authors table...');
        db.run(`
            CREATE TABLE authors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                birth_date TEXT,
                top_work TEXT
            )` , (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Authors table created successfully.');
                
                //Add Authors
                addAuthor('J. K. Rowling');
                addAuthor('George Orwell');
                addAuthor('Stephen King');
                addAuthor('Edgar Allan Poe');
                addAuthor('C.S.Lewis');
                addAuthor('Jane Austen');
                addAuthor('Bram Stocker');
            }
        });
    }
});

//Calling external Library & adding to the authors
function addAuthor(authorName){
    const url = `https://openlibrary.org/search/authors.json?q=${authorName}`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data +=chunk;
        });

        res.on('end', () => {
            try{
                const response = JSON.parse(data);

                const { name, birth_date, top_work } = response.docs[0];
                db.run('INSERT INTO authors (name, birth_date, top_work) VALUES (?, ?, ?)', [name, birth_date, top_work], (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log('Author inserted successfully.');
                    }
                  });

            } catch(error){
                console.log( { error: error } );
            }
        })
    }).on('error', (error) => {
        console.log({error: error});
    })
}

//Calling external Library & adding to the books
function addBooks(bookName){
    const url = `https://openlibrary.org/search.json?q=${bookName}`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data +=chunk;
        });

        res.on('end', () => {
            try{
                const response = JSON.parse(data);

                const { title, author_name, first_publish_year } = response.docs[0];
                db.run('INSERT INTO books (title, author, first_publish_year) VALUES (?, ?, ?)', [title, author_name[0], first_publish_year], (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log('Book inserted successfully.');
                    }
                  });

            } catch(error){
                console.log( { error: error } );
            }
        })
    }).on('error', (error) => {
        console.log({error: error});
    })
}

module.exports = db;

