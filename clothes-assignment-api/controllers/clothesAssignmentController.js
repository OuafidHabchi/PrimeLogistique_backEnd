// Obtenir toutes les assignations
exports.getAllAssignments = async (req, res) => {
    try {
        const ClothesAssignment = req.connection.models.ClothesAssignment; // Modèle injecté dynamiquement
        const assignments = await ClothesAssignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des assignations.' });
    }
};

// Obtenir une assignation par ID
exports.getAssignmentById = async (req, res) => {
    try {
        const ClothesAssignment = req.connection.models.ClothesAssignment;
        const assignment = await ClothesAssignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignation non trouvée.' });
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'assignation.' });
    }
};

// Ajouter une nouvelle assignation
exports.createAssignment = async (req, res) => {
    try {
        const ClothesAssignment = req.connection.models.ClothesAssignment;
        const { clothesId, employeeId, quantite, createdBy } = req.body;
        const newAssignment = new ClothesAssignment({ clothesId, employeeId, quantite, createdBy });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la création de l\'assignation.' });
    }
};

// Supprimer une assignation
exports.deleteAssignment = async (req, res) => {
    try {
        const ClothesAssignment = req.connection.models.ClothesAssignment;
        const deletedAssignment = await ClothesAssignment.findByIdAndDelete(req.params.id);
        if (!deletedAssignment) return res.status(404).json({ error: 'Assignation non trouvée.' });
        res.status(200).json({ message: 'Assignation supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'assignation.' });
    }
};
