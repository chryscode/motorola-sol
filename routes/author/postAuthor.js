const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.post('/', async (req, res, next) => {
    const { operation, id, name, birth_year, biography } = req.body;

    if (!operation) {
        return res.status(400).json({ error: 'Need to specify operation INSERT/UPDATE/DELETE' });
    }

    try {
        switch (operation) {
            case 'INSERT':
                if (!name) {
                    return res.status(400).json({ error: 'Author name is required' });
                }

                res.json(await db.insertAuthor({ name, birth_year, biography }));
                break;
            case 'DELETE':
                if (!id) {
                    return res.status(400).json({ error: 'Author id is required' });
                }

                res.json(await db.deleteAuthor(id));
                break;
            case 'UPDATE':
                if (!id) {
                    return res.status(400).json({ error: 'Id needs to be specified to update a book!' });
                }

                res.json(await db.updateAuthor({ id, name, birth_year, biography }));
                break;
            default:
                return res.status(400).json({ error: 'Incorrect operation specified' });
        }
    } catch (error) {
        console.error('Error processing author request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;