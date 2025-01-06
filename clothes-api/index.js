// app.js
const express = require('express');
const cors = require('cors');
const clothesRoutes = require('./routes/clothesRoutes');
const dbMiddleware = require('../utils/middleware');

const app = express();
const PORT = 3018;

// Middleware global
app.use(cors());
app.use(express.json());

// Middleware pour la connexion dynamique
app.use(dbMiddleware);

// Routes pour les vêtements
app.use('/api', clothesRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Clothes API running on port ${PORT}`);
});
