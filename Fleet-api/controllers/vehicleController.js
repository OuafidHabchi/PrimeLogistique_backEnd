// Ajouter un véhicule
exports.addVehicle = async (req, res) => {
    try {
        const { vehicleNumber, model, type, geotab, vin, license, Location, status } = req.body;

        const Vehicle = req.connection.models.Vehicle; // Modèle injecté dynamiquement
        const newVehicle = new Vehicle({ vehicleNumber, model, type, geotab, vin, license, Location, status });
        await newVehicle.save();

        res.status(201).json({ message: 'Véhicule ajouté avec succès', vehicle: newVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule', error });
    }
};

// Récupérer tous les véhicules
exports.getAllVehicles = async (req, res) => {
    try {
        const Vehicle = req.connection.models.Vehicle;
        const vehicles = await Vehicle.find();

        res.status(200).json({ data: vehicles });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des véhicules', error });
    }
};

// Récupérer un véhicule par ID
exports.getVehicleById = async (req, res) => {
    try {
        const Vehicle = req.connection.models.Vehicle;
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        res.status(200).json({ data: vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du véhicule', error });
    }
};

// Mettre à jour un véhicule par ID
exports.updateVehicleById = async (req, res) => {
    try {
        const { vehicleNumber, model, type, geotab, vin, license, Location, status } = req.body;

        const Vehicle = req.connection.models.Vehicle;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { vehicleNumber, model, type, geotab, vin, license, Location, status },
            { new: true, runValidators: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        res.status(200).json({ message: 'Véhicule mis à jour avec succès', vehicle: updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du véhicule', error });
    }
};

// Supprimer un véhicule par ID
exports.deleteVehicleById = async (req, res) => {
    try {
        const Vehicle = req.connection.models.Vehicle;
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        res.status(200).json({ message: 'Véhicule supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du véhicule', error });
    }
};
