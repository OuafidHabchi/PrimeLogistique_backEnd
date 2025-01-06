const mongoose = require('mongoose');


const worningSchema = new mongoose.Schema({
    employeID: { type: String, required: true },
    type:{ type: String, required: true },
    startDate:{type: String},
    endDate:{type: String},
    raison: { type: String, required: true },
    focus:{type: String},
    description: { type: String, required: true },
    date: { type: String, required: true },
    severity: { type: String },
    read: { type: Boolean, default: false },
    signature: { type: Boolean, default: false },
    photo: { type: Buffer }, // Ajout du champ photo

});

module.exports = worningSchema;
