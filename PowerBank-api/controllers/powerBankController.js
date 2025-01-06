exports.createPowerBank = async (req, res) => {
    try {
        const PowerBank = req.connection.models.PowerBank; // Modèle dynamique
        const powerBank = new PowerBank(req.body);
        await powerBank.save();
        res.status(201).json(powerBank);
    } catch (error) {
        console.error('Erreur lors de la création du PowerBank:', error);
        res.status(400).json({ message: 'Erreur lors de la création du PowerBank', error });
    }
};

exports.getAllPowerBanks = async (req, res) => {
    try {
        const PowerBank = req.connection.models.PowerBank; // Modèle dynamique
        const powerBanks = await PowerBank.find();
        res.status(200).json(powerBanks);
    } catch (error) {
        console.error('Erreur lors de la récupération des PowerBanks:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des PowerBanks', error });
    }
};

exports.getPowerBankById = async (req, res) => {
    try {
        const PowerBank = req.connection.models.PowerBank; // Modèle dynamique
        const powerBank = await PowerBank.findById(req.params.id);
        if (!powerBank) return res.status(404).json({ message: 'PowerBank introuvable' });
        res.status(200).json(powerBank);
    } catch (error) {
        console.error('Erreur lors de la récupération du PowerBank:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du PowerBank', error });
    }
};

exports.updatePowerBank = async (req, res) => {
    try {
        const PowerBank = req.connection.models.PowerBank; // Modèle dynamique
        const powerBank = await PowerBank.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!powerBank) return res.status(404).json({ message: 'PowerBank introuvable' });
        res.status(200).json(powerBank);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du PowerBank:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour du PowerBank', error });
    }
};

exports.deletePowerBank = async (req, res) => {
    try {
        const PowerBank = req.connection.models.PowerBank; // Modèle dynamique
        const powerBank = await PowerBank.findByIdAndDelete(req.params.id);
        if (!powerBank) return res.status(404).json({ message: 'PowerBank introuvable' });
        res.status(200).json({ message: 'PowerBank supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du PowerBank:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du PowerBank', error });
    }
};

exports.getFunctionalPowerBanks = async (req, res) => {
    try {
        const PowerBank = req.connection.models.PowerBank; // Modèle dynamique
        const functionalPowerBanks = await PowerBank.find({ functional: true });
        res.status(200).json(functionalPowerBanks);
    } catch (error) {
        console.error('Erreur lors de la récupération des PowerBanks fonctionnels:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des PowerBanks fonctionnels', error });
    }
};
