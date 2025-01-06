const express = require('express');
const cors = require('cors');
const roadRoutes = require('./routes/RoadRoutes'); // Routes des routes
const dbMiddleware = require('../utils/middleware'); // Middleware dynamique

const app = express();
const PORT = 3015;

// Middleware
app.use(cors());
app.use(express.json());
app.use(dbMiddleware); // Utilisation du middleware dynamique

// Routes
app.use('/api/roads', roadRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
