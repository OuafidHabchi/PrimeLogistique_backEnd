const express = require('express');
const cors = require('cors');
const vanAssignmentRoutes = require('./routes/vanAssignmentRoutes');
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Utilisation du middleware dynamique

// Routes
app.use('/api', vanAssignmentRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`VanAssignment API running on port ${PORT}`);
});
