const express = require('express');
const cors = require('cors');
const dbMiddleware = require('../utils/middleware');
const assignmentRoutes = require('./routes/clothesAssignmentRoutes');

const app = express();
const PORT = 3019;

// Middleware global
app.use(cors());
app.use(express.json());

// Middleware pour gérer dynamiquement la base de données
app.use(dbMiddleware);

// Routes
app.use('/api', assignmentRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`ClothesAssignment API running on port ${PORT}`);
});
