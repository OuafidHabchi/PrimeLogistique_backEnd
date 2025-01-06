const mongoose = require('mongoose');

const dailyNoteSchema = new mongoose.Schema({
  problemDescription: { type: String, required: true },
  problemType: { type: String, required: true },
  employee: {
    familyName: { type: String, required: true },
    name: { type: String, required: true },
  },
  assignedVanNameForToday: { type: String, required: true },
  lu: { type: Boolean },
  today: { type: String },
  time: { type: String },
  photo: { type: Buffer },
});

// Middleware pour définir automatiquement l'heure locale
dailyNoteSchema.pre('save', function (next) {
  const now = new Date();
  const userLocalTime = now.toLocaleTimeString();
  this.time = userLocalTime;
  next();
});

module.exports = { schema: dailyNoteSchema, modelName: 'DailyNote' }; // Préparation pour le système multi-DB
