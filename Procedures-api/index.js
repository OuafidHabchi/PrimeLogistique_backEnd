const express = require('express');
const cors = require('cors');
const procedureRoutes = require('./routes/procedureRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = 3021;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Gestion dynamique des bases de données et modèles

// Routes
app.use('/api/procedure', procedureRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Procedure server running on port ${PORT}`);
});
