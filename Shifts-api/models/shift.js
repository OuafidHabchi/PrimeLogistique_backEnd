const mongoose = require('mongoose');

// Schéma pour les shifts
const shiftSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    starttime: { type: String, required: true },
    endtime: { type: String, required: true },
    color: { type: String, required: true },
    visible: { type: Boolean, default: true },
});

module.exports = { schema: shiftSchema };
