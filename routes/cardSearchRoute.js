const express = require('express');
const router = express.Router();
const cardSearchController = require('../controllers/cardSearchController')

// GET route to return sample parsed data (for testing)
router.get('/cardSearch', cardSearchController.cardSearchController);

module.exports = router;