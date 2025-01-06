const mongoose = require('mongoose');

// Définition du schéma
const clothesSchema = new mongoose.Schema({
    type: { type: String, required: true },
    size: { type: String, required: true },
    quantite: { type: Number, required: true },
    date: { type: String, required: true },
    createdBy: { type: String, required: true }
});

// Exporter le schéma et le nom du modèle
module.exports = { schema: clothesSchema, modelName: 'Clothes' };
