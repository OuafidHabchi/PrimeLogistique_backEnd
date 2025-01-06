const mongoose = require('mongoose');

const dailyViolationSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  type: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, required: true },
  date: { type: String, required: true },
  seen: { type: Boolean },
});

module.exports = { schema: dailyViolationSchema, modelName: 'DailyViolation' };
