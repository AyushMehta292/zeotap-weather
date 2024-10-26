// models/WeatherSummary.js
const mongoose = require('mongoose');

const WeatherSummarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String
});

module.exports = mongoose.model('WeatherSummary', WeatherSummarySchema);
