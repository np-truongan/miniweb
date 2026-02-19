require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static('public')); // Serves your HTML/JS/CSS

// Starter Route: Fetch data from a 'posts' table
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});