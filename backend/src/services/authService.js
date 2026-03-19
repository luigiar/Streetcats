const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

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

module.exports = {
    registerUser
};
