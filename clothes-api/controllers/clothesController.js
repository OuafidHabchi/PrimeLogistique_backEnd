// controllers/clothesController.js

// Obtenir tous les vêtements
exports.getAllClothes = async (req, res) => {
    try {
        const Clothes = req.connection.models.Clothes; // Récupérer depuis req.connection
        const clothes = await Clothes.find();
        res.status(200).json(clothes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des vêtements.' });
    }
};

// Obtenir un vêtement par ID
exports.getClothesById = async (req, res) => {
    try {
        const Clothes = req.connection.models.Clothes;
        const clothes = await Clothes.findById(req.params.id);
        if (!clothes) return res.status(404).json({ error: 'Vêtement non trouvé.' });
        res.status(200).json(clothes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du vêtement.' });
    }
};

// Ajouter un nouveau vêtement
exports.createClothes = async (req, res) => {
    try {
        const Clothes = req.connection.models.Clothes;
        const newClothes = new Clothes(req.body);
        await newClothes.save();
        res.status(201).json(newClothes);
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la création du vêtement.' });
    }
};

// Mettre à jour un vêtement
exports.updateClothes = async (req, res) => {
    try {
        const Clothes = req.connection.models.Clothes;
        const updatedClothes = await Clothes.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClothes) return res.status(404).json({ error: 'Vêtement non trouvé.' });
        res.status(200).json(updatedClothes);
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la mise à jour du vêtement.' });
    }
};

// Supprimer un vêtement
exports.deleteClothes = async (req, res) => {
    try {
        const Clothes = req.connection.models.Clothes;
        const deletedClothes = await Clothes.findByIdAndDelete(req.params.id);
        if (!deletedClothes) return res.status(404).json({ error: 'Vêtement non trouvé.' });
        res.status(200).json({ message: 'Vêtement supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du vêtement.' });
    }
};
