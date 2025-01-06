const express = require('express');
const cors = require('cors');
const commentRoutes = require('./routes/commentRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware pour la gestion dynamique des DB

const app = express();
const PORT = 3020;

// Middleware global
app.use(cors());
app.use(express.json());

// Middleware pour gérer dynamiquement la base de données
app.use(dbMiddleware);

// Routes
app.use('/api/comments', commentRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Comment API running on port ${PORT}`);
});
