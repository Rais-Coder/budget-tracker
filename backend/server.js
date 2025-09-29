const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Import database (JSON database will auto-initialize)
require('./config/database');

const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budget');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'budget-tracker-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Budget Tracker API - Running on Windows' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:3000`);
  console.log(`Backend API: http://localhost:${PORT}`);
  console.log(`Database: JSON files in data/ directory`);
});