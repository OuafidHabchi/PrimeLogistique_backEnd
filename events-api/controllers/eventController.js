// Créer un événement
exports.createEvent = async (req, res) => {
    try {
        const Event = req.connection.models.Event; // Modèle injecté dynamiquement
        const event = new Event(req.body);
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les événements
exports.getEvents = async (req, res) => {
    try {
        const Event = req.connection.models.Event; // Modèle injecté dynamiquement
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un événement par ID
exports.getEventById = async (req, res) => {
    try {
        const Event = req.connection.models.Event; // Modèle injecté dynamiquement
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un événement
exports.updateEvent = async (req, res) => {
    try {
        const Event = req.connection.models.Event; // Modèle injecté dynamiquement
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
    try {
        const Event = req.connection.models.Event; // Modèle injecté dynamiquement
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
