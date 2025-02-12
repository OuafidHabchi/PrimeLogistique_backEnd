const fs = require('fs');
const path = require('path');
const { sendPushNotification } = require('../../utils/notifications');

// Répertoire pour stocker les images
const uploadDirectory = path.join(__dirname, '../uploadsdailynote');

// Vérifiez si le répertoire existe, sinon créez-le
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

exports.createDailyNote = async (req, res) => {
    try {
        console.log("Request received at createDailyNote");

        const DailyNote = req.connection.models.DailyNote;

        console.log("Parsing request body...");
        const dailyNoteData = {
            problemDescription: req.body.problemDescription,
            problemType: req.body.problemType,
            employee: JSON.parse(req.body.employee),
            assignedVanNameForToday: req.body.assignedVanNameForToday,
            today: Array.isArray(req.body.today) ? req.body.today[0] : req.body.today, // Assure une seule date
            time: req.body.time,
        };

        console.log("Parsed dailyNoteData:", dailyNoteData);

        // Gestion du fichier (photo)
        if (req.file) {
            console.log("File detected, adding photo path...");
            dailyNoteData.photo = `uploads-daily-notes/${req.file.filename}`; // Récupérer uniquement le chemin du fichier
        } else {
            console.log("No file provided in the request.");
        }

        // Crée une nouvelle instance de DailyNote avec les données
        const dailyNote = new DailyNote(dailyNoteData);
        console.log("DailyNote instance created:", dailyNote);

        // Sauvegarde la note dans la base de données
        await dailyNote.save();
        console.log("DailyNote saved successfully:", dailyNote);

        // Répond avec succès
        res.status(201).send(dailyNote);

        // Envoi de la notification push (si le token est disponible)
        if (req.body.expoPushToken) {
            console.log("Sending push notification...");
            const notificationTitle = "New Daily Note Created";
            const notificationBody = `A new note has been created: \"${req.body.problemDescription}\". Check it now!`;
            await sendPushNotification(req.body.expoPushToken, notificationTitle, notificationBody);
            console.log("Push notification sent.");
        }
    } catch (error) {
        console.error("Error in createDailyNote:", error.message);
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

        const DailyNote = req.connection.models.DailyNote;
        const dailyNotes = await DailyNote.find({ today: date });
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

        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
