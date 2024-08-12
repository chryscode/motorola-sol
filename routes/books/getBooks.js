const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.get('/',  async (req, res, next) => {
    try{
        const dataObject = await db.selectTable('books');
        res.json(dataObject);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;