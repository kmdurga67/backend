const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');

/**
 * @route POST /api/auth/login
 * @desc Authenticate admin
 * @access Public
 */
router.post('/login', loginAdmin);

module.exports = router;
