const express = require('express');
const cors = require('cors');
const dbMiddleware = require('../utils/middleware'); // Middleware pour connexions dynamiques
const shiftRoutes = require('./routes/shiftRoutes'); // Routes pour les shifts

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware global
app.use(cors());
app.use(express.json());

// Middleware pour connexions dynamiques
app.use(dbMiddleware);

// Routes pour les shifts
app.use('/api', shiftRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Shift API running on port ${PORT}`);
});
