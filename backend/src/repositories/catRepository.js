const { pool } = require('../config/db');

const insertCat = async (title, description, latitude, longitude, imageUrl, userId) => {
  const result = await pool.query(
        'INSERT INTO cats (title, description, latitude, longitude, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, latitude, longitude, imageUrl, userId]
  );
  return result.rows[0];
};

const findAllCats = async () => {
  const result = await pool.query(
       `SELECT c.*, u.username 
         FROM cats c 
         JOIN users u ON c.user_id = u.id 
         ORDER BY c.created_at DESC`
  );
  return result.rows;
};

module.exports = {insertCat, findAllCats};
