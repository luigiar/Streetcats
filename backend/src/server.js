require('dotenv').config();
const express =require('express');
const cors = require('cors'); 
const {pool} = require('./config/db'); //import della connessione al database


const authRoutes = require('./routes/authRoutes.js'); //import delle rotte di autenticazione
const catRoutes = require('./routes/catRoutes.js'); //import delle rotte per i gatti
const commentRoutes = require('./routes/commentRoutes.js'); //import delle rotte per i commenti

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:4200', //url del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] }));

app.use(express.json()); //permette al server di leggere i dati in formato json.
// Rende pubblica la cartella 'uploads' per poter visualizzare le foto dei gatti
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);
app.use('/api/cats/:catId/comments', commentRoutes);

//rotta di toDateString();
app.get('/', async (req,res) => {
  try {
    //piccola query al db per chiedere l'ora attuale
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Benvenuto le API di Streetcats!',
      database_status: 'Connesso con successo!',
      db_time: result.rows[0].now
    });
  } catch (err){
    console.error('Errore di connessione al DB:', err);
    res.status(500).json({ error : 'Database non può essere raggiunto'});
  }
});


// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(` Server in esecuzione sulla porta http://localhost:${PORT}`);
});
