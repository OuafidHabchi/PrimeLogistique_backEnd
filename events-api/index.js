const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique
const app = express();
const PORT = process.env.PORT || 3011;

// Middleware global
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Middleware pour les connexions dynamiques

// Routes
app.use('/api', eventRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Employe API running on port ${PORT}`);
});
