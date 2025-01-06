const mongoose = require('mongoose');

// Définition du schéma pour les disponibilités
const disponibiliteSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },  // Référence à l'ID de l'employé
    selectedDay: { type: String, required: true }, // Jour sélectionné
    shiftId: { type: String, required: true },     // Référence à l'ID du shift
    decisions: { type: String },                  // Décisions (optionnel)
    confirmation: { type: String },               // Confirmation (optionnel)
    presence: { type: String },                   // Présence (optionnel)
    expoPushToken: { type: String },              // Token pour les notifications push (optionnel)
});

// Exportation du schéma et du nom du modèle
module.exports = { schema: disponibiliteSchema, modelName: 'Disponibilite' };
