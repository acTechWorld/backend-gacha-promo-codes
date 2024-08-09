// repository.js
const db = require('../config/db');



// Create promo code Awards details
const createPromoCodeAwardsDetail = (data) => {
  const {promo_code_id, label, count} = data
  const query = 'INSERT INTO promo_code_awards_details (promo_code_id, label, count) VALUES (?, ?, ?)';
  return db.query(query, [promo_code_id, label, count]);
};

// Get all promo code Awards details
const getAllPromoCodeAwardsDetails = () => {
  return db.query('SELECT * FROM promo_code_awards_details');
};

// Get promo code Awards details by promo code ID
const getPromoCodeAwardsDetailsByPromoCodeId = (promo_code_id) => {
  return db.query('SELECT * FROM promo_code_awards_details WHERE promo_code_id = ?', [promo_code_id]);
};

// Update promo code Awards details
const updatePromoCodeAwardsDetail = (id, data) => {
  const {promo_code_id, label, count} = data
  const query = 'UPDATE promo_code_awards_details SET promo_code_id = ?, label = ?, count = ? WHERE id = ?';
  return db.query(query, [promo_code_id, label, count, id]);
};

// Delete promo code Awards details
const deletePromoCodeAwardsDetail = (id) => {
  return db.query('DELETE FROM promo_code_awards_details WHERE id = ?', [id]);
};

const deletePromoCodeAwardsDetailsByPromoCodeId = async (promoCodeId) => {
  const query = 'DELETE FROM promo_code_awards_details WHERE promo_code_id = ?';
  await db.query(query, [promoCodeId]);
};

module.exports = {
  createPromoCodeAwardsDetail,
  getAllPromoCodeAwardsDetails,
  getPromoCodeAwardsDetailsByPromoCodeId,
  updatePromoCodeAwardsDetail,
  deletePromoCodeAwardsDetail,
  deletePromoCodeAwardsDetailsByPromoCodeId
};
