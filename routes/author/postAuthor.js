const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/', async (req, res, next) => {
    const { operation, id, name,  birth_year, biography } = req.body;
    
    if( !operation ){
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    switch(operation) {
        case 'INSERT':
            if (!name) {
                return res.status(400).json({ error: 'Author name is required' });
            }
            const message = await db.insertAuthor( { name, birth_year, biography } );
            res.json(message);
            break;
        case 'DELETE':
            if(!id) {
                return res.status(400).json({ error: 'Author id is required' });
            }
        
            //Check if the author is present id
            db.get('SELECT * FROM authors WHERE id = ?', id, (err, row) => {
                if(err){
                    console.error(err.message);
                    return res.status(400).json({ error: 'Error validating the author' }); 
                }else if (!row){
                    return res.status(400).json({ error: 'No such author is available' });
                }else {
                    db.run('DELETE FROM authors WHERE id = ?', id, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Error deleting author' });
                        }
                        console.log('Author deleted successfully');

                        //Delete assocaited books to maintain ref integrity
                        db.run('DELETE FROM books WHERE author_id = ?', id, (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: 'Error deleting books' });
                            }
                            console.log('Associated Books deleted successfully');
                        });

                        res.json({ message: 'Author & associated books deleted successfully' });
                    });

                    
                }
            });
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
                    db.run('UPDATE authors SET name = ?, birth_year = ?, biography = ? WHERE id = ?', [name, birth_year, biography, id], (err) => {
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