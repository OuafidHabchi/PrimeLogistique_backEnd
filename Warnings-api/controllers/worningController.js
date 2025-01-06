const { sendPushNotification } = require('../../utils/notifications'); // Importer la fonction de notification

// Obtenir toutes les warnings
// Obtenir toutes les warnings sans les photos
exports.getAllWornings = async (req, res) => {
    try {
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
        const wornings = await Worning.find().select('-photo'); // Exclure le champ photo
        res.status(200).json(wornings);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des warnings', error: err });
    }
};


// Obtenir un warning par ID avec gestion de l'image
exports.getWorningById = async (req, res) => {
    try {
        const { id } = req.params;
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
        const worning = await Worning.findById(id);
        if (!worning) {
            return res.status(404).send({ error: "Warning not found." });
        }

        // Include the image with a Base64 prefix
        const worningWithPhoto = {
            ...worning.toObject(),
            photo: worning.photo ? `data:image/jpeg;base64,${worning.photo.toString('base64')}` : null,
        };

        res.status(200).send(worningWithPhoto);
    } catch (error) {
        res.status(500).send({ error: "Error while fetching warning details.", details: error.message });
    }
};




// Ajouter un nouveau warning
exports.createWorning = async (req, res) => {
    try {
        // Valider les données requises
        if (!req.body.employeID || !req.body.type || !req.body.raison || !req.body.description || !req.body.date) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique

        // Créer un nouvel objet Warning
        const newWorning = new Worning({
            employeID: req.body.employeID,
            type: req.body.type,
            raison: req.body.raison,
            description: req.body.description,
            severity: req.body.severity || "",
            startDate: req.body.startDate || "",
            endDate: req.body.endDate || "",
            date: req.body.date,
            read: req.body.read === "true",
            signature: req.body.signature === "true",
        });

        // Ajouter la photo si présente
        if (req.file) {
            newWorning.photo = req.file.buffer;
        }

        // Sauvegarder dans la base de données
        const savedWorning = await newWorning.save();

        // Vérifiez si un expoPushToken est fourni et envoyez une notification
        if (req.body.expoPushToken) {
            const notificationTitle = "New Warning Created";
            const notificationBody = `A warning of type ${req.body.type} has been created. Check the details in your app.`;

            try {
                await sendPushNotification(req.body.expoPushToken, notificationTitle, notificationBody);
                console.log("Notification sent successfully");
            } catch (error) {
                console.error("Error sending push notification:", error);
            }
        }

        res.status(201).json(savedWorning);
    } catch (err) {
        console.error("Erreur lors de la création du warning:", err);
        res.status(500).json({ message: "Erreur lors de la création du warning", error: err });
    }
};



// Mettre à jour un warning
exports.updateWorning = async (req, res) => {
    try {
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
        const updateData = { ...req.body };
        // Supprimer l'image si `removePhoto` est true
        if (req.body.removePhoto === "true") {
            updateData.photo = null;
        }
        // Ajouter une nouvelle photo si elle est envoyée
        if (req.file) {
            updateData.photo = req.file.buffer;
        }
        const updatedWorning = await Worning.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedWorning) return res.status(404).json({ message: "Warning introuvable" });

        res.status(200).json(updatedWorning);
    } catch (err) {
        console.error("Erreur lors de la mise à jour du warning:", err);
        res.status(500).json({ message: "Erreur lors de la mise à jour du warning", error: err });
    }
};



// Supprimer un warning
exports.deleteWorning = async (req, res) => {
    try {
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
        const deletedWorning = await Worning.findByIdAndDelete(req.params.id);
        if (!deletedWorning) return res.status(404).json({ message: 'Warning introuvable' });
        res.status(200).json({ message: 'Warning supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du warning', error: err });
    }
};

// Obtenir tous les warnings par employeID
exports.getWorningsByEmployeID = async (req, res) => {
    try {
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
        const employeID = req.params.employeID;
        const wornings = await Worning.find({ employeID }).select('-photo');;
        if (wornings.length === 0) return res.status(200).json([]); // Pas de warnings, réponse vide
        res.status(200).json(wornings);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des warnings', error: err });
    }
};


// Ajouter plusieurs warnings
exports.createMultipleWarnings = async (req, res) => {
    try {
        const warnings = req.body;
        const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
        // Validation de l'entrée
        if (!Array.isArray(warnings) || warnings.length === 0) {
            return res.status(400).json({ message: 'Invalid input. Provide an array of warnings.' });
        }

        // Formater la date pour chaque warning
        const formattedWarnings = warnings.map(warning => ({
            ...warning,
            date: new Date().toISOString().split('T')[0] // Date formatée en 'YYYY-MM-DD'
        }));

        // Insérer plusieurs warnings
        const savedWarnings = await Worning.insertMany(formattedWarnings);
        res.status(200).json({ message: 'Warnings created successfully', data: savedWarnings });

        // Envoyer des notifications pour chaque warning avec expoPushToken
        const notifications = formattedWarnings.filter(w => w.expoPushToken);
        if (notifications.length > 0) {
            const notificationPromises = notifications.map(warning => {
                const notificationTitle = "New Warning Created";
                const notificationBody = `A warning of type ${warning.type} has been created. Check the details in your app.`;

                return sendPushNotification(warning.expoPushToken, notificationTitle, notificationBody);
            });

            // Attendre que toutes les notifications soient envoyées
            Promise.allSettled(notificationPromises)
                .then(results => {
                    results.forEach((result, index) => {
                        if (result.status === 'rejected') {
                            console.error(`Notification failed for warning ${index}:`, result.reason);
                        } else {
                            console.log(`Notification sent successfully for warning ${index}`);
                        }
                    });
                })
                .catch(error => {
                    console.error("Error sending batch notifications:", error);
                });
        } else {
            console.warn("No expoPushToken provided for any warnings in the batch.");
        }
    } catch (err) {
        console.error("Erreur lors de la création de plusieurs warnings:", err);
        res.status(500).json({ message: 'Erreur lors de la création de plusieurs warnings', error: err.message });
    }
};

exports.checkSuspensionsForEmployees = async (req, res) => {
    const Worning = req.connection.models.Worning; // Utilisation du modèle dynamique
    const { employeIDs, date } = req.body;
    // Valider les paramètres
    if (!employeIDs || !Array.isArray(employeIDs) || employeIDs.length === 0 || !date) {
        return res.status(400).json({
            message: 'employeIDs (array) et date (string) sont requis',
        });
    }

    try {
        // Convertir la date en une chaîne formatée
        const formattedDate = new Date(date).toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

        // Construire la requête pour vérifier les suspensions
        const query = {
            employeID: { $in: employeIDs },
            type: 'suspension',
            $or: [
                {
                    startDate: { $lte: formattedDate },
                    endDate: { $gte: formattedDate },
                },
                {
                    startDate: { $exists: false },
                    endDate: { $exists: false },
                },
            ],
        };

        // Exécuter la requête MongoDB
        const suspensions = await Worning.find(query);

        // Mapper les résultats pour retourner un statut pour chaque employé
        const suspensionStatuses = employeIDs.reduce((statuses, id) => {
            statuses[id] = suspensions.some(
                (suspension) => suspension.employeID === id
            );
            return statuses;
        }, {});

        // Retourner les résultats
        return res.status(200).json({ suspensions: suspensionStatuses });
    } catch (error) {
        console.error('Erreur lors de la vérification des suspensions :', error);
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            error: error.message,
        });
    }
};


