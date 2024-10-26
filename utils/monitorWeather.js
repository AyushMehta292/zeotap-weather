const Weather = require('../models/Weather');
const WeatherAlert = require('../models/WeatherAlert');
const nodemailer = require('nodemailer');

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use any email service you prefer (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  }
});

// Function to send email alerts
const sendEmailAlert = async (recipient, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender's email address
      to: recipient, // Recipient's email address
      subject: subject,
      text: message
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to check weather thresholds and trigger alerts
const checkThresholds = async () => {
  try {
    // Fetch the latest weather data (adjust logic as per your system)
    const latestWeatherData = await Weather.find().sort({ timestamp: -1 }).limit(10);  // Example to get latest 10 records

    latestWeatherData.forEach(async (data) => {
      // Example alert threshold: temperature exceeding 35°C
      // console.log(data.temp);
      if (data.temp > 20) {
        // Check if temperature exceeds the threshold for two consecutive updates
        const previousData = await Weather.find({ city: data.city }).sort({ timestamp: -1 }).limit(2);
        // console.log(previousData.length);
        if (previousData.length >= 2 && previousData[1].temp > 20) {
          // Create an alert if the threshold is breached for two consecutive updates
          const alertMessage = `Alert: Temperature in ${data.city} has exceeded 35°C for two consecutive updates. Current temperature: ${data.temp}°C`;

          // Save the alert in the database
          const alert = new WeatherAlert({
            city: data.city,
            condition: `Temperature exceeded 35°C for two consecutive updates`,
            message: alertMessage
          });
          await alert.save();

          console.log(`Alert triggered for ${data.city}: ${alertMessage}`);

          // Send email alert
          const emailRecipient = process.env.ALERT_RECIPIENT; // Define a recipient email address in your environment variables
          sendEmailAlert(emailRecipient, `Weather Alert for ${data.city}`, alertMessage);
        }
      }
    });
  } catch (error) {
    console.error('Error checking thresholds:', error.message);
  }
};

module.exports = checkThresholds;
