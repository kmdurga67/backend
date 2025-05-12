const bcrypt = require('bcryptjs');
const db = require('./config/database.js');
require('dotenv').config();

const initializeAdmin = async () => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS.split(',');
    const adminPasswords = process.env.ADMIN_PASSWORDS.split(',');
    const adminNames = process.env.ADMIN_NAMES ? process.env.ADMIN_NAMES.split(',') : [];

    if (adminEmails.length !== adminPasswords.length) {
      console.error("Error: Number of emails and passwords must match in .env file.");
      return;
    }

    for (let i = 0; i < adminEmails.length; i++) {
      const email = adminEmails[i].trim();
      const password = adminPasswords[i].trim();
      const name = adminNames[i] ? adminNames[i].trim() : email.split('@')[0];

      const { rows } = await db.query(
        'SELECT * FROM admins WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query(
          'INSERT INTO admins (email, password_hash, name) VALUES ($1, $2, $3)',
          [email, hashedPassword, name]
        );
        console.log(`Admin user created: ${email} with name ${name}`);
      } else {
        if (!rows[0].name) {
          await db.query(
            'UPDATE admins SET name = $1 WHERE email = $2',
            [name, email]
          );
          console.log(`Updated name for admin: ${email}`);
        }
        console.log(`Admin already exists: ${email}`);
      }
    }
  } catch (err) {
    console.error('Error initializing admins:', err);
  }
};

module.exports = { initializeAdmin };