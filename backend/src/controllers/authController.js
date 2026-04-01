const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Delego il lavoro al Service: creo l'utente nel database
        await authService.registerUser(username, email, password);

        // Faccio un "auto-login" silenzioso usando i dati appena inseriti
        // Questo genererà il token
        const autoLoginResult = await authService.loginUser(email, password);

        //  Rispondo al frontend con  quello che gli serve 
        res.status(201).json({
            message: 'Utente registrato e loggato con successo!',
            token: autoLoginResult.token,
            user: autoLoginResult.user
        });

   } catch (error) {
        // Intercetto sia l'errore testuale del Service, sia l'errore nativo di PostgreSQL (23505 = unique_violation)
        if (error.message === 'Email o username già in uso' || error.code === '23505') {
            return res.status(400).json({ error: 'Email o username già in uso' });
        }
        
        // Altrimenti è un vero errore di sistema
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};

//funzione di login
const login = async(req,res) =>{
  try {
    const { email, password } = req.body;

    //passo il lavoro al service
    const result = await authService.loginUser(email, password);
    //se va tutto bene rispondo con status 200 e il token
    res.status(200).json({
    message: 'Login effettuato con successo!',
    token: result.token,
    user: result.user
});
  } catch (error) {
    //se c'è un erorre di credenziali, rispondo con 401
    if(error.message === 'Credenziali non valide') {
      return res.status(401).json({ error: error.message });
  }
  console.error('Errore durante il login:', error);
  res.status(500).json({ error: 'Errore interno del server' });
  }

};

module.exports = {
register,
login
};

