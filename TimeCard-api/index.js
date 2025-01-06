const express = require('express');
const cors = require('cors');
const timeCardRoutes = require('./routes/timeCardRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Utilisation du middleware dynamique

// Routes
app.use('/api', timeCardRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`TimeCard API running on port ${PORT}`);
});
