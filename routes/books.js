const express = require('express');
const router = express.Router();

const db = require('../db')

router.get('/',  function(req, res, next){
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
})

module.exports = router;