const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/', async (req, res, next) => {
    const { operation, id, title, author, publication_year, description } = req.body;

    if (!operation) {
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    try {
        switch (operation) {
            case 'INSERT':
                if (!title || !author) {
                    return res.status(400).json({ error: 'Title and author are required' });
                }

                res.json(await db.insertBook({ title, author, publication_year, description }));

                break;
            case 'DELETE':
                if (!id) {
                    return res.status(400).json({ error: 'Book id is required' });
                }

                res.json(await db.deleteBook(id));

                break;
            case 'UPDATE':
                if (!id) {
                    return res.status(400).json({ error: 'Id needs to be specified to update a book!' });
                }
                res.json(await db.updateBook({ id, title, author, publication_year, description }));
                break;
            default:
                return res.status(400).json({ error: 'Incorrect operation specified' });
        }
    } catch (error) {
        console.error('Error processing book request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;