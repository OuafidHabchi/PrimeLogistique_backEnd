const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Chemin du dossier de destination pour les uploads
const uploadDir = path.join(__dirname, '../uploads');

// Vérifie si le dossier existe, sinon le crée
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier créé : ${uploadDir}`);
}

// Configuration de Multer pour sauvegarder les fichiers dans le dossier uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Dossier cible pour les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom du fichier sauvegardé
  }
});

const upload = multer({ storage });

module.exports = upload;
