const mongoose = require('mongoose');

// Définition du schéma
const dailyNoteSchema = new mongoose.Schema({
  problemDescription: { type: String, required: true },
  problemType: { type: String, required: true },
  employee: {
    familyName: { type: String, required: true },
    name: { type: String, required: true },
  },
  assignedVanNameForToday: { type: String, required: true },
  lu: { type: Boolean, default: false },
  today: { type: String }, // Par défaut, la date d'aujourd'hui
  time: { type: String, }, // Par défaut, l'heure locale
  photo: { type: Buffer },
});

// Export du schéma
module.exports = dailyNoteSchema;
