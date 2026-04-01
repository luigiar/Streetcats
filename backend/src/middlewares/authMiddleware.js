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
    // Se l'errore è specificamente la scadenza
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token scaduto. Fai di nuovo il login.' });
    }
    // Per tutti gli altri errori (token falso, modificato, ecc.)
    return res.status(401).json({ error: 'Token non valido.' });
}};

module.exports = { protect };
