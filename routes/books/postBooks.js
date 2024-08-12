const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/',  (req, res, next) => {
    const { operation, id, title, author, publication_year, description } = req.body;
    
    if( !operation ){
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    switch(operation) {
        case 'INSERT':
            if (!title || !author) {
                return res.status(400).json({ error: 'Title and author are required' });
            }

            //Get the author_id from the authors table
            db.get('SELECT id FROM authors WHERE name = ?', author, (err, row) => {
                if (err) {
                    return res.status(400).json({ error: err });
                } else if (!row) {
                    return res.status(400).json({ error:'Author not found' });
                } else {
                    const author_id = row.id;
                    db.get('SELECT id FROM books WHERE title = ? AND author_id = ?', [title, author_id], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return res.status(400).json({ error: 'Error adding book' });
                        } else if (!row) {
                            db.run('INSERT INTO books (title, author_id, publication_year, description) VALUES (?, ?, ?, ?)', [title, author_id, publication_year, description], (err) => {
                                if (err) {
                                    return res.status(400).json({ error: err });
                                } else {
                                    return res.json({ message: 'Book inserted successfully.'});
                                }
                            });
                        }else {
                            return res.json({ message: 'Book added successfully' });
                        }
                    });        
                }
            });
            
            break;
        case 'DELETE':
            if (!id){
               return res.status(400).json({ error: 'Book id is required' });
            }
            //Check if the book is present id
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                if(err){
                    console.error(err.message);
                    return res.status(400).json({ error: 'Error validating the book' }); 
                }else if (!row){
                    return res.status(400).json({ error: 'No such book is available' });
                }else {
                    db.run('DELETE FROM books WHERE id = ?', id, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Error deleting book' });
                        }
                        return res.json({ message: 'Book deleted successfully' });
                    });
                }
            });
            break;
        case 'UPDATE':
            if( !id ){
                return res.status(400).json({ error: 'Id needs to be specified to update a book!' });
            }

            db.get('SELECT * FROM books WHERE id = ?', id, (err, row) => {
                if(err){
                    console.error(err.message);
                    return res.status(400).json({ error: 'Error validating the book' }); 
                }
                else if (!row){
                    return res.status(400).json({ error: 'No such book is available' });
                }
                else {
                    db.run('UPDATE books SET title = ?, author = ?, first_publish_year = ? WHERE id = ?', [title, author, first_publish_year, id], (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Error updating book' });
                        }
                        res.json({ message: 'Book updated successfully' });
                    });
                }
            });
            break;
        default:
            return res.status(400).json({ error: 'Incorrect operation specified' });
    }
})

module.exports = router;