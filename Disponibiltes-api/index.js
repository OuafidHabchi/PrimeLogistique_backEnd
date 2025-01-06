const express = require('express');
const cors = require('cors');
const disponibiliteRoutes = require('./routes/disponibiliteRoutes');
const dbMiddleware = require('../utils/middleware'); // Importer le middleware pour les bases de données dynamiques

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware pour parser les requêtes JSON
app.use(cors());
app.use(express.json());

// Middleware pour gérer dynamiquement la base de données
app.use(dbMiddleware);

// Utilisation des routes
app.use('/api', disponibiliteRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Disponibilite API running on port ${PORT}`);
});
