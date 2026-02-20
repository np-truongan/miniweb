// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};