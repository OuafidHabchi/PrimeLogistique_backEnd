const express = require('express');
const cors = require('cors');
const reportIssuesRoutes = require('./routes/reportIssuesRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Gestion dynamique des bases de données et modèles

// Routes
app.use('/api/reportIssues', reportIssuesRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Report Issues API running on port ${PORT}`);
});
