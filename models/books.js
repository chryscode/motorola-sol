
class Books {
    async getAllBooks(db, callback){
        db.all('SELECT * FROM books', (err, rows) => {
            if (err) {
                callback(err);
            }
            callback(null, books);
        });
    }
}