const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Contrôleur pour gérer l'upload et le parsing du fichier CSV
exports.uploadCSV = (req, res) => {  
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier uploadé' });
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  const results = [];

  // Lire et parser le fichier CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      // Supprime le fichier après traitement
      fs.unlinkSync(filePath);
      
      // Renvoie les données parsées au client
      res.json(results);
    })
    .on('error', (err) => {
      res.status(500).json({ message: 'Erreur lors de la lecture du fichier CSV', error: err });
    });
};
