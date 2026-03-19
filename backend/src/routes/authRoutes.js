const express = require('express');
const router = express.Router();
//import della funzione register
const { register } = require('../controllers/authController.js');

//quando qualcuno fa una richiesta post all'indirizzo register parte la funzione
router.post('/register', register);

module.exports = router;
