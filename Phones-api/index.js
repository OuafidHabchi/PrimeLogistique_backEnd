const express = require('express');
const cors = require('cors');
const phoneRoutes = require('./routes/phoneRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = 3016;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Injecter la logique dynamique de gestion des modèles et connexions

// Routes
app.use('/api', phoneRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Phone API running on port ${PORT}`);
});
