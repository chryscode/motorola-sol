const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/',  (req, res, next) => {
    const { operation, id, name, biography, date_of_birth } = req.body;
    
    if( !operation ){
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    switch(operation) {
        case 'INSERT':
            if (!name) {
                return res.status(400).json({ error: 'Author name is required' });
            }
            db.get('SELECT id FROM authors WHERE name = ?', name, (err, row) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).json({ error: 'Error adding author' });
                } else if (!row) {
                    db.run('INSERT INTO authors (name, biography, date_of_birth) VALUES (?, ?, ?)', [name, biography, date_of_birth], (err) => {
                        if (err) {
                            console.error(err.message);
                            return res.status(500).json({ error: 'Error adding author' });
                        } else {
                            res.json({ message: 'Author inserted successfully'});
                        }
                    });
                } else {
                    res.json({ message: 'Author added successfully' });
                }
            });
            break;
        case 'DELETE':
            if (id && name){
                //Check if the author is present with all the parameters
                db.get('SELECT * FROM authors WHERE id = ? AND name = ?', [id, name], (err, row) => {
                    if(err){
                        console.error(err.message);
                        return res.status(400).json({ error: 'Error validating the author' }); 
                    }
                    else if (!row){
                        return res.status(400).json({ error: 'No such author is available' });
                    }
                    else {
                        db.run('DELETE FROM authors WHERE id = ?', id, (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: 'Error deleting author' });
                            }
                            res.json({ message: 'Author deleted successfully' });
                        });
                    }
                });
            } else if (id || name){
                if (id){
                    //Check if the author is present id
                    db.get('SELECT * FROM authors WHERE id = ?', id, (err, row) => {
                        if(err){
                            console.error(err.message);
                            return res.status(400).json({ error: 'Error validating the author' }); 
                        }
                        else if (!row){
                            return res.status(400).json({ error: 'No such author is available' });
                        }
                        else {
                            db.run('DELETE FROM authors WHERE id = ?', id, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: 'Error deleting author' });
                                }
                                res.json({ message: 'Author deleted successfully' });
                            });
                        }
                    });
                } else {
                    //Check if the author is present with name 
                    db.get('SELECT * FROM authors WHERE name = ?', name, (err, row) => {
                        if(err){
                            console.error(err.message);
                            return res.status(400).json({ error: 'Error validating the author' }); 
                        }
                        else if (!row){
                            return res.status(400).json({ error: 'No such author is available' });
                        }
                        else {
                            db.run('DELETE FROM authors WHERE name = ?', name, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: 'Error deleting author' });
                                }
                                res.json({ message: 'Author deleted successfully' });
                            });
                        }
                    });
                }
            } else {
                return res.status(400).json({ error: 'Either id or name are required' });
            }
            break;
        case 'UPDATE':
            if( !id ){
                return res.status(400).json({ error: 'Id needs to be specified to update a book!' });
            }

            db.get('SELECT * FROM authors WHERE id = ?', id, (err, row) => {
                if(err){
                    console.error(err.message);
                    return res.status(400).json({ error: 'Error validating the author' }); 
                }
                else if (!row){
                    return res.status(400).json({ error: 'No such author is available' });
                }
                else {
                    db.run('UPDATE authors SET name = ?, biography = ?, date_of_birth = ? WHERE id = ?', [name, biography, date_of_birth, id], (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Error updating author' });
                        }
                        res.json({ message: 'Author updated successfully' });
                    });
                }
            });
            break;
        default:
            return res.status(400).json({ error: 'Incorrect operation specified' });
    }
})

module.exports = router;