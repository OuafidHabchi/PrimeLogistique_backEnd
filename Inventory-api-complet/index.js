const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = 3023;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Utilisation du middleware dynamique

// Routes
app.use('/api/inventory', inventoryRoutes);

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Inventory API running on port ${PORT}`);
});
