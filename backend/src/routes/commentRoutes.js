const express = require('express');
//  { mergeParams: true } per poter leggere :catId dall'URL principale
const router = express.Router({ mergeParams: true }); 
const {createComment, fetchComments} = require('../controllers/commentController.js');
const {protect} = require ('../middlewares/authMiddleware.js');

// GET /api/cats/:catId/comments - Pubblica
router.get('/', fetchComments); 

// POST /api/cats/:catId/comments - Protetta
router.post('/', protect, createComment);

module.exports = router;
