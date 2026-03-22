const commentRepo = require('../repositories/commentRepository.js');

const addComment = async (content, userId, catId) => {
  //niente commenti vuoti o senza riferimento al gatto
  if(!content || !catId) {
    throw new Error ('il testo del commento e l\'ID del gatto sono obbligatori!. ');

  }
  return await commentRepo.insertComment(content, userId, catId);

};

const getComments = async (catId) => {
  return await comentRepo.findCommentsByCatId(catId);
};

module.exports = {addComment, getComments};
