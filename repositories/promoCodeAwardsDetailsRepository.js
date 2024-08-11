// repositories/promoCodeAwardsRepository.js
const db = require('../config/db');

// Create a new promo code award detail
const createPromoCodeAwardsDetail = (data) => {
    const { promo_code_id, award_item_id, count, label } = data;
    const query = 'INSERT INTO promo_code_awards_details (promo_code_id, award_item_id, count, label) VALUES (?, ?, ?, ?)';
    return db.query(query, [promo_code_id, award_item_id, count, label]);
};

// Get all promo code award details
const getAllPromoCodeAwardsDetails = () => {
    return db.query('SELECT * FROM promo_code_awards_details');
};

// Get promo code award details by promo code ID
const getPromoCodeAwardsDetailsByPromoCodeId = (promo_code_id) => {
    return db.query('SELECT * FROM promo_code_awards_details WHERE promo_code_id = ?', [promo_code_id]);
};

// Get promo code award details by award item ID
const getPromoCodeAwardsDetailsByAwardItemId = (award_item_id) => {
    return db.query('SELECT * FROM promo_code_awards_details WHERE award_item_id = ?', [award_item_id]);
};

// Update a promo code award detail
const updatePromoCodeAwardsDetail = (id, data) => {
    const { promo_code_id, award_item_id, count } = data;
    const query = 'UPDATE promo_code_awards_details SET promo_code_id = ?, award_item_id = ?, count = ? WHERE id = ?';
    return db.query(query, [promo_code_id, award_item_id, count, id]);
};

// Delete a promo code award detail
const deletePromoCodeAwardsDetail = (id) => {
    return db.query('DELETE FROM promo_code_awards_details WHERE id = ?', [id]);
};

// Delete all promo code award details by promo code ID
const deletePromoCodeAwardsDetailsByPromoCodeId = (promo_code_id) => {
    const query = 'DELETE FROM promo_code_awards_details WHERE promo_code_id = ?';
    return db.query(query, [promo_code_id]);
};

// Delete all promo code award details by award item ID
const deletePromoCodeAwardsDetailsByAwardItemId = (award_item_id) => {
    const query = 'DELETE FROM promo_code_awards_details WHERE award_item_id = ?';
    return db.query(query, [award_item_id]);
};

module.exports = {
    createPromoCodeAwardsDetail,
    getAllPromoCodeAwardsDetails,
    getPromoCodeAwardsDetailsByPromoCodeId,
    getPromoCodeAwardsDetailsByAwardItemId,
    updatePromoCodeAwardsDetail,
    deletePromoCodeAwardsDetail,
    deletePromoCodeAwardsDetailsByPromoCodeId,
    deletePromoCodeAwardsDetailsByAwardItemId
};
