const express = require('express');
const cors = require('cors');
const dbMiddleware = require('../utils/middleware'); // Middleware pour gérer les connexions dynamiques
const employeRoutes = require('./routes/EmployeRoutes'); // Routes des employés

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors());
app.use(express.json());

// Middleware pour injecter la connexion dynamique
app.use(dbMiddleware);

// Routes pour les employés
app.use('/api/employee', employeRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Employe API running on port ${PORT}`);
});
