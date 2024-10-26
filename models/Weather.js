// models/Weather.js
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: String,
  temp: Number,
  feels_like: Number,
  main: String,  // Weather condition (e.g., Clear, Rain)
  timestamp: Number,  // Unix timestamp from API
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weather', weatherSchema);
