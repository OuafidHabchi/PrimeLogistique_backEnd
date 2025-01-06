const express = require('express');
const cors = require('cors');
const dailyNoteRoutes = require('./routes/dailyNoteRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware pour gérer les connexions dynamiques

const app = express();
const PORT = process.env.PORT || 3009;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Middleware pour injecter la connexion dynamique

// Routes
app.use('/api', dailyNoteRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Daily Note API running on port ${PORT}`);
});
