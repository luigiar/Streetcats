const catService = require('../services/catService');

const createCat = async (req, res) => {
    try {
        const userId = req.user.userId; 
        
        const { title, description, latitude, longitude } = req.body;

// Controlliamo se l'immagine è stata caricata
        if (!req.file) {
            return res.status(400).json({ error: 'L\'immagine del gatto è obbligatoria!' });
        }

        // Creiamo il percorso pubblico dell'immagine (es. /uploads/1628192.jpg)
        const imageUrl = `/uploads/${req.file.filename}`;

        //  Salviamo nel database tramite il Service
        const newCat = await catService.addCat(
            title, description, latitude, longitude, imageUrl, userId
        );

        res.status(201).json({
            message: 'Gatto avvistato e salvato con successo! 🐾',
            cat: newCat
        });
    } catch (error) {
        console.error('Errore creazione gatto:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};

const getCats = async (req, res) => {
    try {
        const cats = await catService.getAllCats();
        res.status(200).json(cats);
    } catch (error) {
        console.error('Errore recupero gatti:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};

module.exports = { createCat, getCats };
