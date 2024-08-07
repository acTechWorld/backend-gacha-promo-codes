// repository.js
const db = require('../config/db');


// Create promo code value description
const createPromoCodeValueDescription = (description) => {
  const query = 'INSERT INTO promo_code_awards_description (description) VALUES (?)';
  return db.query(query, [description]);
};

// Get all promo code value descriptions
const getAllPromoCodeValueDescriptions = () => {
  return db.query('SELECT * FROM promo_code_awards_description');
};

// Get promo code value description by ID
const getPromoCodeValueDescriptionById = (id) => {
  return db.query('SELECT * FROM promo_code_awards_description WHERE id = ?', [id]);
};

// Update promo code value description
const updatePromoCodeValueDescription = (id, description) => {
  const query = 'UPDATE promo_code_awards_description SET description = ? WHERE id = ?';
  return db.query(query, [description, id]);
};

// Delete promo code value description
const deletePromoCodeValueDescription = (id) => {
  return db.query('DELETE FROM promo_code_awards_description WHERE id = ?', [id]);
};

module.exports = {
  createPromoCodeValueDescription,
  getAllPromoCodeValueDescriptions,
  getPromoCodeValueDescriptionById,
  updatePromoCodeValueDescription,
  deletePromoCodeValueDescription
};
