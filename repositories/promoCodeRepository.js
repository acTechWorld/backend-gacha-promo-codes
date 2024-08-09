// repository.js
const db = require('../config/db');

// Create promo code
const createPromoCode = (data) => {
  const { description, award_type, award_id, status } = data;
  const query = 'INSERT INTO promo_codes (description, award_type, award_id, status) VALUES (?, ?, ?, ?)';
  return db.query(query, [description, award_type, award_id, status]);
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
  const { description, award_type, award_id, status } = data;
  const query = 'UPDATE promo_codes SET description = ?, award_type = ?, award_id = ?, status = ? WHERE id = ?';
  return db.query(query, [description, award_type, award_id, status, id]);
};

// Delete promo code
const deletePromoCode = (id) => {
  return db.query('DELETE FROM promo_codes WHERE id = ?', [id]);
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode
};
