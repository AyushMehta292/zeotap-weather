const mongoose = require('mongoose');

const weatherAlertSchema = new mongoose.Schema({
  city: String,
  condition: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeatherAlert', weatherAlertSchema);
