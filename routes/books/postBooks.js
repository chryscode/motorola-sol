const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/', async (req, res, next) => {
    const { operation, id, title, author, publication_year, description } = req.body;
    
    if( !operation ){
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    let message;
    switch(operation) {
        case 'INSERT':
            if (!title || !author) {
                return res.status(400).json({ error: 'Title and author are required' });
            }

            message = await db.insertBook({ title, author, publication_year, description } );
            res.json(message);

            break;
        case 'DELETE':
            if (!id){
               return res.status(400).json({ error: 'Book id is required' });
            }
            
            message = await db.deleteBook(id);
            res.json(message);

            break;
        case 'UPDATE':
            if( !id ){
                return res.status(400).json({ error: 'Id needs to be specified to update a book!' });
            }

            const message = await db.updateBook({ id, title, author, publication_year, description });
            res.json(message);
            break;
        default:
            return res.status(400).json({ error: 'Incorrect operation specified' });
    }
})

module.exports = router;