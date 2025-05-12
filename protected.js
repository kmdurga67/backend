const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authMiddleware');

/**
 * @route GET /api/protected/fetch
 * @desc Protected route example
 * @access Private (Admin only)
 */
router.get('/fetch', authAdmin, (req, res) => {
  try {
    res.json({ 
      message: `Welcome ${req.admin.name}`,
      admin: {
        id: req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        last_login: req.admin.last_login
      }
    });
  } catch (error) {
    console.error('Protected route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;