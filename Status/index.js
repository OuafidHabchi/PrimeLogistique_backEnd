const express = require('express');
const cors = require('cors');
const statusRoutes = require('./routes/statusRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Middleware dynamique

// Routes
app.use('/api/statuses', statusRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Status API running on port ${PORT}`);
});
