const express = require('express');
const router = express.Router();
const {createComment, fetchComments} = require('../controllers/commentController.js');

const {protect} = require ('../middlewares/authMiddleware.js');

// GET /api/comments/:catId Pubblica chiunque può leggere i commenti 
router.get('/:catId', fetchComments);

// POST /api/comments  Protetta solo chi ha il token può commentare
router.post('/', protect, createComment);

module.exports = router;
