const {pool} = require ('../config/db.js');

const insertComment = async (content, userId, catId) => {
const result = await pool.query(
`INSERT INTO comments (content, user_id, cat_id) 
         VALUES ($1, $2, $3) RETURNING *`,
         [content, userId, catId]
  );
  return result.rows[0];
};

const findCommentsByCatId = async (catId) => {
//prendiamo i comment e con una join uniamo la tabella users per avere l'username di chi ha commentato
const result = await pool.query(
`SELECT c.*, u.username 
         FROM comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.cat_id = $1 
         ORDER BY c.created_at ASC`,
        [catId]
  );
  return result.rows;

};

module.exports = { insertComment, findCommentsByCatId };
