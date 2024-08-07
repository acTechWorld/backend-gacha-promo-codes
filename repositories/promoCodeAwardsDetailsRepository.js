// repository.js
const db = require('../config/db');



// Create promo code value details
const createPromoCodeValueDetails = (promo_code_id, label, count) => {
  const query = 'INSERT INTO promo_code_value_details (promo_code_id, label, count) VALUES (?, ?, ?)';
  return db.query(query, [promo_code_id, label, count]);
};

// Get all promo code value details
const getAllPromoCodeValueDetails = () => {
  return db.query('SELECT * FROM promo_code_awards_details');
};

// Get promo code value details by promo code ID
const getPromoCodeValueDetailsByPromoCodeId = (promo_code_id) => {
  return db.query('SELECT * FROM promo_code_awards_details WHERE promo_code_id = ?', [promo_code_id]);
};

// Update promo code value details
const updatePromoCodeValueDetails = (id, promo_code_id, label, count) => {
  const query = 'UPDATE promo_code_awards_details SET promo_code_id = ?, label = ?, count = ? WHERE id = ?';
  return db.query(query, [promo_code_id, label, count, id]);
};

// Delete promo code value details
const deletePromoCodeValueDetails = (id) => {
  return db.query('DELETE FROM promo_code_awards_details WHERE id = ?', [id]);
};

module.exports = {
  createPromoCodeValueDetails,
  getAllPromoCodeValueDetails,
  getPromoCodeValueDetailsByPromoCodeId,
  updatePromoCodeValueDetails,
  deletePromoCodeValueDetails
};
