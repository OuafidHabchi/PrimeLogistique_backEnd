const express = require('express');
const cors = require('cors');
const dailyViolationRoutes = require('./routes/dailyViolationRoutes');
const dbMiddleware = require('../utils/middleware');

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Middleware pour gérer la connexion dynamique à la base de données

// Routes
app.use('/api', dailyViolationRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`DailyViolation API running on port ${PORT}`);
});
