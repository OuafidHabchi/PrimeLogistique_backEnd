const express = require('express');
const cors = require('cors');
const csvRoutes = require('./routes/csvRoutes'); // Import des routes

const app = express();
const port = 3002;

// Middlewares globaux
app.use(cors());

// Utilisation des routes
app.use('/csv', csvRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js démarré sur http://localhost:${port}`);
});
