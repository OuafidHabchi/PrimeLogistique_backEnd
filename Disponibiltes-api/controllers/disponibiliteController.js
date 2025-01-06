const { log } = require('node:console');
const { sendPushNotification } = require('../../utils/notifications'); // Importer ta fonction d'envoi de notifications


// Créer une disponibilité
exports.createDisponibilite = async (req, res) => {
    const { employeeId, selectedDay, shiftId, expoPushToken } = req.body;
    console.log(employeeId, selectedDay, shiftId, expoPushToken);
    const decisions = "pending";

    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Créer et sauvegarder une nouvelle disponibilité
        const newDisponibilite = new Disponibilite({ employeeId, selectedDay, shiftId, decisions, expoPushToken });
        await newDisponibilite.save();

        // Envoyer la réponse immédiatement
        res.status(200).json(newDisponibilite);

        // Envoyer une notification push de manière asynchrone
        if (expoPushToken) {
            sendPushNotification(
                expoPushToken,
                `A new availability has been created for you on ${selectedDay}. Please review it.`
            )
                .then(() => {
                    console.log('Notification sent successfully');
                })
                .catch((notificationError) => {
                    console.error('Error sending push notification:', notificationError);
                });
        }
    } catch (err) {
        console.error('Error creating Disponibilite:', err.message);

        // Assurer que la réponse est cohérente même en cas d'erreur après l'envoi
        if (!res.headersSent) {
            res.status(400).json({ error: err.message });
        }
    }
};



// Récupérer toutes les disponibilités
exports.getAllDisponibilites = async (req, res) => {
    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Récupérer toutes les disponibilités
        const disponibilites = await Disponibilite.find();
        res.status(200).json(disponibilites);
    } catch (err) {
        console.error('Error fetching disponibilites:', err.message);
        res.status(500).json({ error: err.message });
    }
};



// Récupérer une disponibilité par ID
exports.getDisponibiliteById = async (req, res) => {
    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Rechercher la disponibilité par ID
        const disponibilite = await Disponibilite.findById(req.params.id);

        if (!disponibilite) {
            return res.status(404).json({ message: 'Disponibilite not found.' });
        }

        res.status(200).json(disponibilite);
    } catch (err) {
        console.error('Error fetching disponibilite by ID:', err.message);
        res.status(500).json({ error: err.message });
    }
};




// Mettre à jour une disponibilité
exports.updateDisponibilite = async (req, res) => {
    const { employeeId, selectedDay, shiftId, decisions, confirmation } = req.body;

    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Mettre à jour la disponibilité
        const updatedDisponibilite = await Disponibilite.findByIdAndUpdate(
            req.params.id,
            { employeeId, selectedDay, shiftId, decisions, confirmation },
            { new: true, runValidators: true }
        );

        if (!updatedDisponibilite) {
            return res.status(404).json({ message: 'Disponibilite not found.' });
        }

        res.status(200).json(updatedDisponibilite);
    } catch (err) {
        console.error('Error updating disponibilite:', err.message);
        res.status(400).json({ error: err.message });
    }
};


// Supprimer une disponibilité
exports.deleteDisponibilite = async (req, res) => {
    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Trouver et supprimer la disponibilité
        const deletedDisponibilite = await Disponibilite.findByIdAndDelete(req.params.id);

        if (!deletedDisponibilite) {
            return res.status(404).json({ message: 'Disponibilite not found.' });
        }

        // Réponse immédiate pour confirmer la suppression
        res.status(200).json({ message: 'Disponibilite deleted successfully.' });

        // Envoyer la notification push de manière asynchrone
        if (deletedDisponibilite.expoPushToken) {
            sendPushNotification(
                deletedDisponibilite.expoPushToken,
                `Your availability on ${deletedDisponibilite.selectedDay} has been deleted.`
            ).then(() => {
                console.log('Notification sent successfully');
            }).catch((notificationError) => {
                console.error('Error sending push notification:', notificationError);
            });
        }

    } catch (err) {
        // Gestion des erreurs lors de la suppression
        console.error('Error deleting disponibilite:', err.message);
        res.status(500).json({ error: err.message });
    }
};




exports.deleteDisponibilitesByShiftId = async (req, res) => {
    const { shiftId } = req.params;

    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Supprimer les disponibilités correspondant au shiftId
        const deletedDisponibilites = await Disponibilite.deleteMany({ shiftId });

        if (deletedDisponibilites.deletedCount === 0) {
            return res.status(404).json({ message: 'No disponibilites found with the provided shiftId.' });
        }

        // Répondre immédiatement au client
        res.status(200).json({ message: `${deletedDisponibilites.deletedCount} disponibilites deleted successfully.` });

        // Récupérer les disponibilités correspondantes pour envoyer des notifications
        const disponibilites = await Disponibilite.find({ shiftId });

        disponibilites.forEach((disponibilite) => {
            if (disponibilite.expoPushToken) {
                sendPushNotification(
                    disponibilite.expoPushToken,
                    `Your availability on ${disponibilite.selectedDay} has been deleted.`
                ).then(() => {
                    console.log('Notification sent successfully');
                }).catch((notificationError) => {
                    console.error('Error sending push notification:', notificationError);
                });
            }
        });

    } catch (err) {
        // Gestion des erreurs
        console.error('Error deleting disponibilites by shiftId:', err.message);
        res.status(500).json({ error: err.message });
    }
};




exports.updateMultipleDisponibilites = async (req, res) => {
    const { decisions } = req.body; // Tableau de décisions avec employeeId, selectedDay, shiftId, et status

    try {
        // Charger le modèle dynamiquement
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        const updatePromises = decisions.map(async (decision) => {
            // Récupérer l'ancienne disponibilité
            const oldDisponibilite = await Disponibilite.findOne({ employeeId: decision.employeeId, selectedDay: decision.selectedDay });

            if (!oldDisponibilite) {
                return null; // Si la disponibilité n'existe pas, on ne fait rien
            }

            // Comparer l'ancienne décision avec la nouvelle pour voir s'il y a un changement
            if (oldDisponibilite.decisions !== decision.status) {
                // Mettre à jour la disponibilité si le statut a changé
                const updatedDisponibilite = await Disponibilite.findOneAndUpdate(
                    { employeeId: decision.employeeId, selectedDay: decision.selectedDay },
                    { decisions: decision.status },
                    { new: true, runValidators: true }
                );

                // Si la disponibilité a un `expoPushToken`, envoyer une notification
                if (updatedDisponibilite.expoPushToken) {
                    await sendPushNotification(
                        updatedDisponibilite.expoPushToken, // Envoi au token de l'utilisateur
                        `Your availability for ${updatedDisponibilite.selectedDay} has been updated with the status: ${decision.status}.`
                    );
                }

                return updatedDisponibilite; // Retourner la disponibilité mise à jour
            }

            return null; // Si pas de changement, on ne fait rien
        });

        // Attendre que toutes les promesses soient résolues
        const results = await Promise.all(updatePromises);

        // Filtrer pour garder uniquement les disponibilités mises à jour
        const updatedDisponibilites = results.filter(dispo => dispo !== null);

        res.status(200).json({
            message: `${updatedDisponibilites.length} disponibilités mises à jour avec succès`,
            updatedDisponibilites
        });
    } catch (err) {
        console.error('Error updating multiple disponibilites:', err.message);
        res.status(500).json({ error: err.message });
    }
};




// Récupérer toutes les disponibilités d'un employé par employeeId
exports.getDisponibilitesByEmployeeId = async (req, res) => {
    const { employeeId } = req.params; // Récupérer employeeId depuis les paramètres de la requête

    try {
        // Charger dynamiquement le modèle Disponibilite
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Chercher les disponibilités en fonction de l'employeeId
        const disponibilites = await Disponibilite.find({ employeeId });
        console.log("disponibilites :"+disponibilites);
        

        // Vérifier si des disponibilités ont été trouvées
        if (disponibilites.length === 0) {
            return res.status(404).json({ message: 'Aucune disponibilité trouvée pour cet employé.' });
        }

        // Retourner les disponibilités trouvées
        res.status(200).json(disponibilites);
    } catch (err) {
        console.error('Erreur lors de la récupération des disponibilités par employeeId:', err.message);
        res.status(500).json({ error: err.message });
    }
};




// Récupérer toutes les disponibilités par jour et employeeId
exports.getDisponibilitesByEmployeeAndDay = async (req, res) => {
    const { employeeId, selectedDay } = req.params; // Récupérer employeeId et selectedDay depuis les paramètres de la requête
    try {
        // Charger dynamiquement le modèle Disponibilite
        const Disponibilite = req.connection.models.Disponibilite;
        console.log(Disponibilite);

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Query MongoDB using employeeId and selectedDay
        const disponibilites = await Disponibilite.find({
            employeeId,
            selectedDay: new Date(selectedDay).toDateString(), // Normaliser le format
        });

        // Retourner une réponse vide si aucune disponibilité n'est trouvée
        return res.status(200).json(disponibilites); // Peut être un tableau vide ou les disponibilités trouvées
    } catch (err) {
        console.error('Erreur lors de la récupération des disponibilités par jour et employeeId:', err.message);
        res.status(500).json({ error: err.message });
    }
};



// Bulk update disponibilites
exports.updateMultipleDisponibilitesConfirmation = async (req, res) => {
    const { confirmations } = req.body; // Expecting an array of confirmations with employeeId, selectedDay, shiftId, and confirmation status

    try {
        // Charger dynamiquement le modèle Disponibilite
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Mise à jour des disponibilités en parallèle
        const updatePromises = confirmations.map((confirmation) => {
            return Disponibilite.findOneAndUpdate(
                { employeeId: confirmation.employeeId, selectedDay: confirmation.selectedDay, shiftId: confirmation.shiftId }, // Filtrer avec employeeId, selectedDay et shiftId
                { confirmation: confirmation.status }, // Mettre à jour le statut de confirmation
                { new: true, runValidators: true }
            );
        });

        const updatedDisponibilites = await Promise.all(updatePromises);

        // Envoyer la réponse immédiatement
        res.status(200).json({ message: 'Disponibilites updated successfully', updatedDisponibilites });

        // Envoyer les notifications de manière asynchrone
        updatedDisponibilites.forEach((disponibilite) => {
            if (disponibilite && disponibilite.expoPushToken) {
                // Déterminer le message de notification en fonction du statut de confirmation
                const statusMessage =
                    disponibilite.confirmation === 'confirmed'
                        ? `Please confirm your presence for ${disponibilite.selectedDay} on your homepage.`
                        : `Your shift on ${disponibilite.selectedDay} has been canceled. You can view this update on your homepage.`;

                sendPushNotification(disponibilite.expoPushToken, statusMessage)
                    .then(() => {
                        console.log('Notification sent successfully');
                    })
                    .catch((notificationError) => {
                        console.error('Error sending push notification:', notificationError);
                    });
            }
        });
    } catch (err) {
        console.error('Error updating multiple disponibilites confirmation:', err.message);
        res.status(500).json({ error: err.message });
    }
};



exports.updateDisponibilitePresenceById = async (req, res) => {
    console.log('Requête reçue avec ID:', req.params.id); // Log pour vérifier si la requête arrive

    const { presence } = req.body;

    try {
        // Charger dynamiquement le modèle Disponibilite
        const Disponibilite = req.connection.models.Disponibilite;

        if (!Disponibilite) {
            return res.status(500).json({ message: 'Disponibilite model is not available in the current connection.' });
        }

        // Mise à jour de la présence
        const disponibilite = await Disponibilite.findByIdAndUpdate(
            req.params.id,
            { presence },
            { new: true, runValidators: true }
        );

        if (!disponibilite) {
            return res.status(404).json({ message: 'Disponibilite not found' });
        }

        res.status(200).json(disponibilite);
    } catch (err) {
        console.error('Error updating presence for disponibilite:', err.message);
        res.status(500).json({ error: err.message });
    }
};






