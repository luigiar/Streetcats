const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //delego il lavoro al Service, che si occuperà di validare i dati e interagire con il database
        const user = await authService.registerUser(username, email, password);

        // Se va tutto bene, rispondo al frontend
        res.status(201).json({
            message: 'Utente registrato con successo!',
            user: user
        });

    } catch (error) {
        // Se il Service ha lanciato l'errore personalizzato, mando un 400
        if (error.message === 'Username o email già in uso') {
            return res.status(400).json({ error: error.message });
        }
        
        // Altrimenti è un vero errore di sistema
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};

module.exports = {
    register
};
