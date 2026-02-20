require('dotenv').config();
console.log("Checking DB URL:", process.env.SUPABASE_URL);
const express = require('express');
const path = require('path');
const cors = require('cors'); // Added for future Android/External access

// Import your Route files
const nodeRoutes = require('./routes/nodeRoutes'); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. API Routes
// All note-related requests will now be handled by your nodeRoutes/Controller
app.use('/api/nodes', nodeRoutes);

// 2. Serve Frontend Static Files
// Point this to your frontend folder based on your new structure
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for any non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});