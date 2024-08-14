const express = require('express');
const router = express.Router();

const db = require('../../data/db')

router.get('/',  async (req, res, next) => {
    try{
        const {authors, books} = await db.selectAuthors();
        // Loop through authors and assign an array of matching books
        authors.forEach(author => {
            author.books = books.filter(book => book.author_id === author.id);
        });
        res.json(authors);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;