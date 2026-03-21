const express = require('express');
const router = express.Router();
const { createCat, getCats } = require('../controllers/catController');


const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); 


router.get('/', getCats);

router.post('/', protect, upload.single('image'), createCat);

module.exports = router;
