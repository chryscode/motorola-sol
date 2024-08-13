const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.get('/',  async (req, res, next) => {
    try{
        const dataObject = await db.selectBooks();
        const output = dataObject.map((e) => ({
            id: e.id,
            title: e.title,
            publication_year: e.publication_year,
            description: e.description,
            author:{
                name: e.name,
                birth_year: e.birth_year,
                biography: e.biography
            }
        }))
        res.json(output);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;