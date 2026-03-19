const { Pool } = require('pg');
require('dotenv').config(); //caricamendo delle variabili dal file .env

//creo la connessione usando le variabili dal dotenv
const pool = new Pool({
  user : process.env.DB_USER,
  host : process.env.DB_HOST,
  database : process.env.DB_NAME,
  password : process.env.DB_PASSWORD,
  port : process.env.DB_PORT,

});

//esportazione del pool, per poterlo usare in altri file

module.exports = {
  query : (text,params) => pool.query(text, params),
  pool

};
