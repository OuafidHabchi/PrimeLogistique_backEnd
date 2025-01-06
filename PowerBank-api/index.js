const express = require('express');
const cors = require('cors');
const powerBankRoutes = require('./routes/powerBankRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = 3017;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Injecter la gestion dynamique des bases de données et modèles

// Routes
app.use('/api', powerBankRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`PowerBank API running on port ${PORT}`);
});
