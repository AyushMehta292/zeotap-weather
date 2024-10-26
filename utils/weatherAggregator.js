// utils/weatherAggregator.js
const Weather = require('../models/Weather');
const WeatherSummary = require('../models/WeatherSummary');

// Helper function to get the dominant weather condition
const getDominantCondition = (conditions) => {
  const frequency = {};
  conditions.forEach(condition => {
    frequency[condition] = (frequency[condition] || 0) + 1;
  });
  return Object.keys(frequency).reduce((a, b) => (frequency[a] > frequency[b] ? a : b));
};

// Function to aggregate weather data for each city at the end of the day
const aggregateDailyWeather = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for today's date range

  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

  try {
    for (const city of cities) {
      // Fetch all weather data for the current day for the city
      const dailyWeather = await Weather.find({
        city,
        date: { $gte: today }
      });

      if (dailyWeather.length > 0) {
        // Calculate aggregates
        const temperatures = dailyWeather.map(data => data.temp);
        const conditions = dailyWeather.map(data => data.main);

        const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);
        const dominantCondition = getDominantCondition(conditions);

        // Save summary to database
        const summary = new WeatherSummary({
          date: today,
          city,
          avgTemp: avgTemp.toFixed(2),
          maxTemp,
          minTemp,
          dominantCondition
        });

        await summary.save();
        console.log(`Weather summary for ${city} saved.`);
      }
    }
  } catch (error) {
    console.error('Error aggregating daily weather data:', error.message);
  }
};

module.exports = {
  aggregateDailyWeather
};
