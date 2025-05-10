const bcrypt = require('bcryptjs');
const db = require('./config/database.js');
require('dotenv').config();

const initializeAdmin = async () => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS.split(',');
    const adminPasswords = process.env.ADMIN_PASSWORDS.split(',');

    if (adminEmails.length !== adminPasswords.length) {
      console.error("Error: Number of emails and passwords must match in .env file.");
      return;
    }

    for (let i = 0; i < adminEmails.length; i++) {
      const email = adminEmails[i].trim();
      const password = adminPasswords[i].trim();

      const { rows } = await db.query(
        'SELECT * FROM admins WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query(
          'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
          [email, hashedPassword]
        );
        console.log(`Admin user created: ${email}`);
      } else {
        console.log(`Admin already exists: ${email}`);
      }
    }
  } catch (err) {
    console.error('Error initializing admins:', err);
  }
};

module.exports = { initializeAdmin };
