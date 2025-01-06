const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Utilisation du middleware dynamique

// Routes
app.use('/api', vehicleRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Employe API running on port ${PORT}`);
});
