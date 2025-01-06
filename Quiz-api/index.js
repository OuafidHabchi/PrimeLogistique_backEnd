const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3014;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Gestion dynamique des bases de données et modèles

// Routes
app.use('/api/quiz', quizRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Quiz API running on port ${PORT}`);
});
