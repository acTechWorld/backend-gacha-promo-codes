// repository.js
const db = require('../config/db');

// Create promo code
const createPromoCode = (data) => {
  const { application, code, description, status, upVote, downVote } = data;
  const query = 'INSERT INTO promo_codes (application, description, code, status, up_vote, down_vote) VALUES (?, ?, ?, ?, ?, ?)';
  return db.query(query, [application, description, code, status, upVote, downVote]);
};

// Get all promo codes
const getAllPromoCodes = () => {
  return db.query('SELECT * FROM promo_codes');
};

// Get promo code by ID
const getPromoCodeById = (id) => {
  return db.query('SELECT * FROM promo_codes WHERE id = ?', [id]);
};

// Update promo code
const updatePromoCode = (id, data) => {
  const { application, description, code, status, upVote, downVote } = data;
  const query = 'UPDATE promo_codes SET application = ?, description = ?, code = ?, status = ?, up_vote = ?, down_vote = ? WHERE id = ?';
  return db.query(query, [application, description, code, status, upVote, downVote, id]);
};

// Delete promo code
const deletePromoCode = (id) => {
  return db.query('DELETE FROM promo_codes WHERE id = ?', [id]);
};

// Method to get all promo codes by application
const getPromoCodesByApplication = async (application) => {
  const query = `
      SELECT *
      FROM promo_codes
      WHERE application = ?
  `;
  const [results] = await db.query(query, [application]);
  return [results];
};


module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
  getPromoCodesByApplication
};
