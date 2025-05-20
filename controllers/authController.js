const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const now = new Date();

    if (admin.lock_until && new Date(admin.lock_until) > now) {
      const remainingTime = Math.ceil((new Date(admin.lock_until) - now) / 60000);
      return res.status(403).json({
        error: 'Account temporarily locked',
        message: `Too many failed attempts. Try again in ${remainingTime} minutes.`
      });
    }

    if (admin.lock_until && new Date(admin.lock_until) <= now) {
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

      const attemptsLeft = MAX_ATTEMPTS - failedAttempts;
      return res.status(401).json({
        error: 'Invalid credentials',
        message: failedAttempts >= MAX_ATTEMPTS
          ? `Account locked. Try again after ${LOCK_TIME / 60000} minutes.`
          : `Invalid credentials. ${attemptsLeft} attempts remaining.`,
      });
    }

    await db.query(
      'UPDATE admins SET last_login = NOW(), failed_attempts = 0, lock_until = NULL WHERE id = $1',
      [admin.id]
    );

    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      // domain:'http://localhost:3000',
      path: '/admin/dashboard/dashboard-content'
      // maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      // admin: {
      //   id: admin.id,
      //   email: admin.email,
      //   name: admin.name
      // },
      message: 'Login Successful',
      redirect:'/admin/dashboard/dashboard-content/'
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};

module.exports = { loginAdmin };