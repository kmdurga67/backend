const express = require('express');
const router = express.Router();
const authAdmin = require('./controllers/authController');

/**
 * @route GET /api/protected
 * @desc Protected route example
 * @access Private (Admin only)
 */
router.get('/fetch', authAdmin, (req, res) => {
  res.json({ message: `Welcome admin ${req.admin.username}` });
});

module.exports = router;