const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route: POST /api/contact
// Desc:  Submit a message from the contact form
router.post('/', contactController.submitContactForm);

module.exports = router;
