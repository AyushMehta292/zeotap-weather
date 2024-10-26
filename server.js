// server.js
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchWeatherData = require('./utils/fetchWeatherData');
const aggregateDailyWeather = require('./utils/fetchWeatherData');
const checkThresholds = require('./utils/monitorWeather');
const Weather = require('./models/Weather');
const WeatherrAlert = require('./models/WeatherAlert');
const WeatherSummary = require('./models/WeatherSummery');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schedule weather data fetching at a configurable interval (e.g., every 5 minutes)
const API_CALL_INTERVAL = "*/5 * * * *"; // default to every 5 minutes

cron.schedule(API_CALL_INTERVAL, () => {
  console.log("Fetching weather data...");
  fetchWeatherData();
});

// API Route to get all stored weather data
app.get('/weather', async (req, res) => {
    try {
      const weatherData = await Weather.find();  // Fetch all weather data from MongoDB
      res.status(200).json(weatherData);  // Send the data as a JSON response
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      res.status(500).json({ message: 'Error retrieving weather data' });
    }
});


// Schedule aggregation job to run at 23:59 every day
cron.schedule('59 23 * * *', () => {
    console.log("Aggregating daily weather data...");
    aggregateDailyWeather(); // Call the aggregator function
});

// API Route to get daily weather summary
app.get('/daily-summary', async (req, res) => {
    try {
      const { city, date } = req.query;
      const query = {};
  
      if (city) query.city = city;
      if (date) query.date = new Date(date);
  
      const summaries = await WeatherSummary.find(query);
      res.status(200).json(summaries);
    } catch (error) {
      console.error('Error fetching daily summaries:', error.message);
      res.status(500).json({ message: 'Error retrieving daily summaries' });
    }
});

// Schedule weather monitoring job to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log("Checking thresholds for alerts...");
    checkThresholds();
});

// API route to fetch triggered alerts
app.get('/api/weather/alerts', async (req, res) => {
  try {
    const alerts = await WeatherrAlert.find();  // Fetch alerts from the database
    res.status(200).json(alerts);  // Send alerts as JSON response
  } catch (error) {
    console.error('Error fetching weather alerts:', error.message);
    res.status(500).json({ message: 'Error retrieving weather alerts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});