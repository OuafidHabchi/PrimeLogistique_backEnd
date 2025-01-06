const express = require('express');
const cors = require('cors');
const worningRoutes = require('./routes/worningRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3013;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Utilisation du middleware dynamique

// Routes
app.use('/api', worningRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`worningRoutes API running on port ${PORT}`);
});
