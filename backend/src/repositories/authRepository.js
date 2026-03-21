const { pool } = require('../config/db');

//trova un utente per email o username
const findUserByEmailOrUsername = async (email, username) => {
  const result = await pool.query(
      'SELECT  * FROM users WHERE email = $1 OR username = $2',
      [email, username]
  );
  return result.rows;
  };

//trova un utente per email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT  * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0]; // Restituisce il primo utente trovato o null se non esiste
};

//salva il nuovo utente nel database
const createUser = async (username, email, passwordHash) => {
  const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );
  return result.rows[0]; // Restituisce l'utente appena creato
};

module.exports = {findUserByEmailOrUsername, findUserByEmail, createUser};
