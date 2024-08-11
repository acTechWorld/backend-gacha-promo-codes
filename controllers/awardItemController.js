// index.js (or your main router file)
const express = require('express');
const router = express.Router();
const awardItemRepository = require('../repositories/awardItemRepository');

// Get all award items
router.get('/award-items', async (req, res) => {
    try {
        const [rows] = await awardItemRepository.getAllAwardItems();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get an award item by ID
router.get('/award-items/:id', async (req, res) => {
    try {
        const [rows] = await awardItemRepository.getAwardItemById(req.params.id);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new award item
router.post('/award-items', async (req, res) => {
    try {
        const result = await awardItemRepository.createAwardItem(req.body);
        res.status(201).json({ id: result[0].insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an award item
router.put('/award-items/:id', async (req, res) => {
    try {
        const result = await awardItemRepository.updateAwardItem(req.params.id, req.body);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ id: req.params.id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an award item
router.delete('/award-items/:id', async (req, res) => {
    try {
        const result = await awardItemRepository.deleteAwardItem(req.params.id);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get award items by application
router.get('/award-items/application/:application', async (req, res) => {
    // Extract the application from the request parameters
    const application = req.params.application;
    try {
        const [rows] = await awardItemRepository.getAwardItemsByApplication(application);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
