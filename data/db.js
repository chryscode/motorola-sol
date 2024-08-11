const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./books.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Create books table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        published_year INTEGER
    )
`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Books table created or already exists.');
});


function getAllBooks(){
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            return 'Error';
        }
        return rows;
    });
}

module.exports = db;

