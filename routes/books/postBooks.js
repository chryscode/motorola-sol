const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/',  (req, res, next) => {
    const { operation, id, title, author, published_year } = req.body;
    
    if( !operation ){
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    switch(operation) {
        case 'INSERT':
            if (!title || !author) {
                return res.status(400).json({ error: 'Title and author are required' });
            }
            db.get('SELECT id FROM books WHERE title = ? AND author = ?', [title, author], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).json({ error: 'Error adding book' });
                } else if (!row) {
                    db.run('INSERT INTO books (title, author, published_year) VALUES (?, ?, ?)', [title, author, published_year], (err) => {
                        if (err) {
                            console.error(err.message);
                            return res.status(500).json({ error: 'Error adding book' });
                        } else {
                            res.json({ message: 'Book inserted successfully'});
                        }
                    });
                } else {
                    res.json({ message: 'Book added successfully' });
                }
            });
            break;
        case 'DELETE':
            if (id && title && author){
                //Check if the book is present with all the parameters
                db.get('SELECT * FROM books WHERE id = ? AND title = ? AND author = ?', [id, title, author], (err, row) => {
                    if(err){
                        console.error(err.message);
                        return res.status(400).json({ error: 'Error validating the book' }); 
                    }
                    else if (!row){
                        return res.status(400).json({ error: 'No such book is available' });
                    }
                    else {
                        db.run('DELETE FROM books WHERE id = ?', id, (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: 'Error deleting book' });
                            }
                            res.json({ message: 'Book deleted successfully' });
                        });
                    }
                });
            } else if (id || (title && author)){
                if (id){
                    //Check if the book is present id
                    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                        if(err){
                            console.error(err.message);
                            return res.status(400).json({ error: 'Error validating the book' }); 
                        }
                        else if (!row){
                            return res.status(400).json({ error: 'No such book is available' });
                        }
                        else {
                            db.run('DELETE FROM books WHERE id = ?', id, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: 'Error deleting book' });
                                }
                                res.json({ message: 'Book deleted successfully' });
                            });
                        }
                    });
                } else {
                    //Check if the book is present with title and author
                    db.get('SELECT * FROM books WHERE title = ? AND author = ?', [title, author], (err, row) => {
                        if(err){
                            console.error(err.message);
                            return res.status(400).json({ error: 'Error validating the book' }); 
                        }
                        else if (!row){
                            return res.status(400).json({ error: 'No such book is available' });
                        }
                        else {
                            db.run('DELETE FROM books WHERE title = ? AND author = ?', [title, author], (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: 'Error deleting book' });
                                }
                                res.json({ message: 'Book deleted successfully' });
                            });
                        }
                    });
                }
            } else {
                return res.status(400).json({ error: 'Either id or title and author are required' });
            }
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
                    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, id], (err) => {
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