const commentService = require ('../services/commentService.js');

const createComment = async (req, res) => {
 try {
        const userId = req.user.userId; // Garantito dal middleware 'protect'
        const { content, catId } = req.body;

        const newComment = await commentService.addComment(content, userId, catId);

        res.status(201).json({
            message: 'Commento aggiunto con successo!',
            comment: newComment
        });
    } catch (error) {
        if (error.message === 'Il testo del commento e l\'ID del gatto sono obbligatori.') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Errore creazione commento:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};


const fetchComments = async (req, res) => {
  try {
        // Estraiamo l'ID del gatto direttamente dall'URL
        const { catId } = req.params; 
        
        const comments = await commentService.getComments(catId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Errore recupero commenti:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};


module.exports = {createComment, fetchComments};
