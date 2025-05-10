const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; 

// const LOCK_TIME = 10 * 1000;

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Required admin login data' });
    }

    const admin = rows[0];
    const now = new Date();

    if (admin.lock_until && new Date(admin.lock_until) > now) {
      return res.status(403).json({ error: 'Too many failed attempts. Try again later.' });
    } else if (admin.lock_until && new Date(admin.lock_until) <= now) {
      await db.query('UPDATE admins SET failed_attempts = 0, lock_until = NULL WHERE id = $1', [admin.id]);
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      const failedAttempts = admin.failed_attempts + 1;
      let lockUntil = null;

      if (failedAttempts >= MAX_ATTEMPTS) {
        lockUntil = new Date(now.getTime() + LOCK_TIME); 
      }

      await db.query(
        'UPDATE admins SET failed_attempts = $1, lock_until = $2 WHERE id = $3',
        [failedAttempts, lockUntil, admin.id]
      );

      return res.status(401).json({
        error: failedAttempts >= MAX_ATTEMPTS
          ? 'Too many failed attempts. Try again later.'
          : 'Invalid credentials',
      });
    }

    await db.query('UPDATE admins SET last_login = NOW(), failed_attempts = 0, lock_until = NULL WHERE id = $1', [admin.id]);

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginAdmin };
