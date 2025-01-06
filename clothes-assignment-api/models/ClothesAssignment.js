const mongoose = require('mongoose');

// Définition du schéma
const clothesAssignmentSchema = new mongoose.Schema({
    clothesId: { type: String, required: true },
    employeeId: { type: String, required: true },
    quantite: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
});

// Exporter le schéma et le nom du modèle
module.exports = { schema: clothesAssignmentSchema, modelName: 'ClothesAssignment' };
