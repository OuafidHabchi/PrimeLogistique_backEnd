const { sendPushNotification } = require('../../utils/notifications');

// Créer une nouvelle DailyNote
exports.createDailyNote = async (req, res) => {
    try {
        const DailyNote = req.connection.models.DailyNote;
        const dailyNoteData = {
            problemDescription: req.body.problemDescription,
            problemType: req.body.problemType,
            employee: JSON.parse(req.body.employee),
            assignedVanNameForToday: req.body.assignedVanNameForToday,
            today: req.body.today,
        };

        if (req.file) {
            dailyNoteData.photo = req.file.buffer;
        }

        const dailyNote = new DailyNote(dailyNoteData);
        await dailyNote.save();

        res.status(201).send(dailyNote);

        if (req.body.expoPushToken) {
            const notificationTitle = "New Daily Note Created";
            const notificationBody = `A new note has been created: "${req.body.problemDescription}". Check it now!`;
            await sendPushNotification(req.body.expoPushToken, notificationTitle, notificationBody);
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Obtenir toutes les DailyNotes
exports.getAllDailyNotes = async (req, res) => {
    try {
        const DailyNote = req.connection.models.DailyNote;
        const dailyNotes = await DailyNote.find();
        res.status(200).send(dailyNotes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtenir les DailyNotes par date
exports.getDailyNotesByDate = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).send({ error: "La date est requise dans la requête." });
        }

        const DailyNote = req.connection.models.DailyNote;;
        const dailyNotes = await DailyNote.find({ today: date }, { photo: 0 });
        res.status(200).send(dailyNotes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Marquer une DailyNote comme lue
exports.markAsRead = async (req, res) => {
    try {
        const { noteId } = req.body;
        if (!noteId) {
            return res.status(400).send({ error: "L'ID de la note est requis." });
        }

        const DailyNote = req.connection.models.DailyNote;
        const updatedNote = await DailyNote.findByIdAndUpdate(noteId, { lu: true }, { new: true });

        if (!updatedNote) {
            return res.status(404).send({ error: "Note introuvable." });
        }

        res.status(200).send(updatedNote);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtenir les détails d'une DailyNote
exports.getNoteDetails = async (req, res) => {
    try {
        const { noteId } = req.params;
        const DailyNote = req.connection.models.DailyNote;
        const note = await DailyNote.findById(noteId);

        if (!note) {
            return res.status(404).send({ error: "Note introuvable." });
        }

        const noteWithPhoto = {
            ...note.toObject(),
            photo: note.photo ? `data:image/jpeg;base64,${note.photo.toString('base64')}` : null,
        };

        res.status(200).send(noteWithPhoto);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
