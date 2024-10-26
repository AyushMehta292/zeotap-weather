// utils/fetchWeatherData.js
const axios = require('axios');
const Weather = require('../models/Weather');
require('dotenv').config();

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const API_KEY = "3cabf1d319604be189e805f87de2bf80";

// Function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

// Fetch weather data for each city
const fetchWeatherData = async () => {
  try {
    const weatherData = await Promise.all(cities.map(async city => {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const data = response.data;

      // Store only necessary fields
      return {
        city,
        temp: kelvinToCelsius(data.main.temp),
        feels_like: kelvinToCelsius(data.main.feels_like),
        main: data.weather[0].main,
        timestamp: data.dt
      };
    }));

    // Save data to MongoDB
    await Weather.insertMany(weatherData);
    console.log("Weather data saved successfully:", weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
  }
};

module.exports = fetchWeatherData;