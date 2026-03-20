const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  //cerchiamo il token nell'header della richiesta http
  const authHeader = req.headers.authorization;

  //se non è presente, restituiamo un errore
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accesso negato, autenticazione richiesta' });
    }
//etraiamo il token dall'header
const token = authHeader.split(' ')[1];

//verifichiamo il token se è valido
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //salvo i dati dell'utente dentro la richiesta
    req.user = decoded;

    //vado avanti con la richiesta
    next();
} catch (error) {
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }

};

module.exports = { protect };
