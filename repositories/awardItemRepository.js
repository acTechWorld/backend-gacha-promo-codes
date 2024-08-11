// repository.js
const db = require('../config/db');

// Create a new award item
const createAwardItem = (data) => {
    const { label, image, application } = data;
    const query = 'INSERT INTO award_items (label, image, application) VALUES (?, ?, ?)';
    return db.query(query, [label, image, application]);
};

// Get all award items
const getAllAwardItems = () => {
    return db.query('SELECT * FROM award_items');
};

// Get an award item by ID
const getAwardItemById = (id) => {
    return db.query('SELECT * FROM award_items WHERE id = ?', [id]);
};

// Update an award item by ID
const updateAwardItem = (id, data) => {
    const { label, image, application } = data;
    const query = 'UPDATE award_items SET label = ?, image = ?, application = ? WHERE id = ?';
    return db.query(query, [label, image, application, id]);
};

// Delete an award item by ID
const deleteAwardItem = (id) => {
    return db.query('DELETE FROM award_items WHERE id = ?', [id]);
};

// Get award items by application
const getAwardItemsByApplication = (application) => {
    const query = 'SELECT * FROM award_items WHERE application LIKE ?';
    return db.query(query, [`%${application}%`]);
};

module.exports = {
    getAwardItemsByApplication,
    createAwardItem,
    getAllAwardItems,
    getAwardItemById,
    updateAwardItem,
    deleteAwardItem
};
