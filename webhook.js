const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // Permet de traiter les données JSON

// Route pour recevoir les événements de webhook
app.post('/webhook', (req, res) => {
  const { type, data } = req.body; // Type d'événement et données associées

  console.log('Webhook reçu :', type, data);

  // Traitez les différents types d'événements
  if (type === 'receipt') {
    console.log('Statut de la notification :', data);
  } else if (type === 'error') {
    console.error('Erreur :', data);
  }

  res.sendStatus(200); // Répondez avec un statut 200 pour confirmer la réception
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur Webhook en cours d'exécution sur le port ${PORT}`);
});
