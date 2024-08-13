const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/', async (req, res, next) => {
    const { operation, id, name,  birth_year, biography } = req.body;
    
    if( !operation ){
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    let message;
    switch(operation) {
        case 'INSERT':
            if (!name) {
                return res.status(400).json({ error: 'Author name is required' });
            }

            message = await db.insertAuthor( { name, birth_year, biography } );
            res.json(message);
            break;
        case 'DELETE':
            if(!id) {
                return res.status(400).json({ error: 'Author id is required' });
            }
        
            message = await db.deleteAuthor(id);
            res.json(message);

            break;
        case 'UPDATE':
            if( !id ){
                return res.status(400).json({ error: 'Id needs to be specified to update a book!' });
            }

            message = await db.updateAuthor({ id, name, birth_year, biography });
            res.json(message);
            
            break;
        default:
            return res.status(400).json({ error: 'Incorrect operation specified' });
    }
})

module.exports = router;