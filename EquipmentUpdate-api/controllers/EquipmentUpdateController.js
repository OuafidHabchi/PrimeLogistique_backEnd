const path = require('path');

exports.createEquipmentUpdate = async (req, res) => {
  try {
    const EquipmentUpdate = req.connection.models.EquipmentUpdate; // Modèle dynamique

    // Log des données reçues
    console.log('Données reçues dans le body :', req.body);
    console.log('Fichier reçu :', req.file);

    const { employeeName, vanName, localTime,userId,photoType,day } = req.body;

    if (!employeeName || !vanName || !localTime) {
      return res.status(400).json({ message: "Les informations de l'employé, du van et du temps sont requises." });
    }

    // Validation si aucun fichier n'est uploadé
    if (!req.file) {
      return res.status(400).json({ message: "L'image est requise." });
    }

    // Création d'un nouvel enregistrement
    const equipmentUpdate = new EquipmentUpdate({
      employeeName,
      vanName,
      localTime,
      imagePath: path.join('/equipment-uploads', req.file.filename),
      userId,
      photoType,
      day
    });

    await equipmentUpdate.save();
    res.status(201).json(equipmentUpdate);
  } catch (error) {
    console.error('Erreur lors de la création de l\'EquipmentUpdate:', error);
    res.status(500).json({ message: "Erreur lors de l'ajout des données.", error });
  }
};


exports.getEquipmentUpdatesByDate = async (req, res) => {
  try {
    const EquipmentUpdate = req.connection.models.EquipmentUpdate; // Modèle dynamique

    const { day, photoType } = req.query; // Récupérer la date et le type via les paramètres de la requête

    if (!day) {
      return res.status(400).json({ message: "Le paramètre 'day' est requis." });
    }

    // Construire la requête de recherche dynamiquement
    const query = { day };

    if (photoType) {
      query.photoType = photoType; // Ajouter le filtre par type si le paramètre est fourni
    }

    // Rechercher les enregistrements correspondant à la requête
    const equipmentUpdates = await EquipmentUpdate.find(query);

    // Retourner la liste vide si aucun enregistrement n'est trouvé
    res.status(200).json(equipmentUpdates || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des données par date et type :', error);
    res.status(500).json({ message: "Erreur lors de la récupération des données.", error });
  }
};

