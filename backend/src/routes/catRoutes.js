const express = require('express');
const router = express.Router();
const { createCat, getCats } = require('../controllers/catController');


const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); 


router.get('/', getCats);

//chiamata a protect per verficare se l'utente è autenticato, poi upload.single('image') 
//per gestire il caricamento dell'immagine e infine createCat per creare un nuovo gatto
router.post('/', protect, upload.single('image'), createCat);

module.exports = router;
