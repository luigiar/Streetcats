const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const registerUser = async (username, email, password) => {
    //  Controllo se esiste già l'email o utente
    const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
    );

    if (userExists.rows.length > 0) {
        throw new Error('Username o email già in uso'); 
    }

    //  Cripto la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Salvo nel database
    const newUser = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, hashedPassword]
    );

    //  Restituisco solo i dati dell'utente creato
    return newUser.rows[0];
};


const loginUser = async (email,password) => {
  //cerchiamo l'utente nel db tramite email
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  //se non c'è l'utente, ritorno errore
  if(userResult.rows.length === 0) {
    throw new Error('Credenziali non valide');
  }

  const user = userResult.rows[0];

  //confronto la password inserita con quella salvata nel db
  const isMatch = await bcrypt.compare(password, user.password_hash);
  //se la password non corrisponde, ritorno errore
  if(!isMatch) {
    throw new Error('Credenziali non valide');
  
}

  //creamo un token JWT
  const token = jwt.sign(
    {userId: user.id, username: user.username}, //dati da inserire nel token
    process.env.JWT_SECRET, //chiave segreta per firmare il token in setInterval
    {expiresIn: '24h'} //scadenza del token
  );
  
  //restituisco il token e i dati dell'utente
  return {
    token,
    user: { id: user.id, username: user.username, email: user.email }
  };

}
  module.exports = {
registerUser,
loginUser
  };
