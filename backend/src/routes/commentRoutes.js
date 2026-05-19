const express = require('express');
//  { mergeParams: true } per poter leggere :catId dall'URL principale
const router = express.Router({ mergeParams: true }); //questo permette di accedere a req.params.catId nei controller dei commenti, 
//visto che la rotta è annidata sotto /api/cats/:catId/comments. Senza mergeParams, req.params sarebbe vuoto in questo router.
const {createComment, fetchComments} = require('../controllers/commentController.js');
const {protect} = require ('../middlewares/authMiddleware.js');

// GET /api/cats/:catId/comments - Pubblica
router.get('/', fetchComments); 

// POST /api/cats/:catId/comments - Protetta
router.post('/', protect, createComment);

module.exports = router;
