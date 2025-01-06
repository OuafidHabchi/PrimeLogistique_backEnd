const mongoose = require('mongoose');

// Définition du schéma
const commentSchema = new mongoose.Schema({
    idEmploye: { type: String, required: true },
    date: { type: String, required: true },
    comment: { type: String, required: true },
});

// Exporter le schéma et le nom du modèle
module.exports = { schema: commentSchema, modelName: 'Comment' };
