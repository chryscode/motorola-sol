const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.get('/',  (req, res, next) => {
    db.all('SELECT * FROM authors', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
})

module.exports = router;