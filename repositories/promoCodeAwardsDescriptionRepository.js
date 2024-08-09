// repository.js
const db = require('../config/db');


// Create promo code awards description
const createPromoCodeAwardsDescription = (description) => {
  const query = 'INSERT INTO promo_code_awards_description (description) VALUES (?)';
  return db.query(query, [description]);
};

// Get all promo code awards descriptions
const getAllPromoCodeAwardsDescriptions = () => {
  return db.query('SELECT * FROM promo_code_awards_description');
};

// Get promo code Awards description by ID
const getPromoCodeAwardsDescriptionById = (id) => {
  return db.query('SELECT * FROM promo_code_awards_description WHERE id = ?', [id]);
};

// Update promo code Awards description
const updatePromoCodeAwardsDescription = (id, description) => {
  const query = 'UPDATE promo_code_awards_description SET description = ? WHERE id = ?';
  return db.query(query, [description, id]);
};

// Delete promo code Awards description
const deletePromoCodeAwardsDescription = (id) => {
  return db.query('DELETE FROM promo_code_awards_description WHERE id = ?', [id]);
};

module.exports = {
  createPromoCodeAwardsDescription,
  getAllPromoCodeAwardsDescriptions,
  getPromoCodeAwardsDescriptionById,
  updatePromoCodeAwardsDescription,
  deletePromoCodeAwardsDescription
};
