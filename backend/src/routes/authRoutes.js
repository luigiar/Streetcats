const express = require('express');
const rateLimit = require('express-rate-limit'); 
const { register, login } = require('../controllers/authController.js');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Troppi tentativi di login falliti, riprova tra 15 minuti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', register);
router.post('/login', loginLimiter, login); 

module.exports = router;
