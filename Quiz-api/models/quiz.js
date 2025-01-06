const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    result: { type: String, required: true },
    date: { type: String, required: true },
});

module.exports = quizSchema;
