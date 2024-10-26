# Weather Monitoring System

## Overview

This project is a real-time data processing system designed to monitor weather conditions and provide summarized insights using rollups and aggregates. The system retrieves weather data from the [OpenWeatherMap API](https://openweathermap.org/api) and processes it to generate daily summaries and alerts based on user-defined thresholds.

## Features

- **Real-Time Data Retrieval:** Continuously fetches weather data for major Indian cities (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad) at configurable intervals.
- **Temperature Conversion:** Converts temperature values from Kelvin to Celsius.
- **Daily Weather Summary:** Aggregates daily weather data to calculate average, maximum, and minimum temperatures, and determines the dominant weather condition.
- **Alerting System:** Triggers alerts when user-defined thresholds are breached, such as temperature exceeding 35°C for two consecutive updates.
- **Visualization:** Displays daily weather summaries, historical trends, and triggered alerts through a web dashboard.

## System Architecture

1. **Data Retrieval:** Utilizes the OpenWeatherMap API to fetch weather data every 5 minutes using the `fetchWeatherData` function.
2. **Data Processing:** Processes the retrieved data to convert temperatures and store them in a [MongoDB](https://www.mongodb.com/) database.
3. **Aggregation:** At the end of each day, the `aggregateDailyWeather` function calculates daily summaries and stores them in the database.
4. **Alerting:** The `checkThresholds` function monitors weather data against predefined thresholds and sends email alerts if conditions are met.
5. **Visualization:** A [React](https://reactjs.org/)-based frontend displays real-time data, daily summaries, and alerts.

## Installation and Setup

### Prerequisites
- React js
- [Node.js](https://nodejs.org/en)
- MongoDB

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweathermap_api_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
ALERT_RECIPIENT=recipient_email_address_for_alerts
API_CALL_INTERVAL=300000
PORT=5000
```

### Installation

1. Clone the repository:


2. Install server dependencies:

   ```bash
   npm install
   ```

3. Install client dependencies:

   ```bash
   cd weather-dashboard
   npm install
   ```

### Running the Application

1. Start the MongoDB server.

2. Run the backend server:

   ```bash
   npm start
   ```

3. Run the frontend:

   ```bash
   cd weather-dashboard
   npm run dev
   ```

4. Access the application at `http://localhost:3000`.

## Testing

- **System Setup:** Ensure the system connects to the OpenWeatherMap API using a valid API key.
- **Data Retrieval:** Simulate API calls and verify data retrieval and parsing.
- **Temperature Conversion:** Test conversion from Kelvin to Celsius.
- **Daily Weather Summary:** Simulate weather updates and verify summary calculations.
- **Alerting Thresholds:** Configure thresholds and simulate data to test alert triggering.

## Additional Features

- Extend support for additional weather parameters like humidity and wind speed.
- Implement weather forecasts and generate summaries based on predicted conditions.

## Design Choices

- [Express.js](https://expressjs.com/) for the backend server to handle API requests and data processing.
- MongoDB for storing weather data and summaries.
- React with [Vite](https://vitejs.dev/) for the frontend to provide a responsive and interactive user interface.
- [Node-cron](https://www.npmjs.com/package/node-cron) for scheduling periodic data retrieval and processing tasks.

## Dependencies

- Express
- [Mongoose](https://mongoosejs.com/)
- [Axios](https://axios-http.com/docs/api_intro)
- [Nodemailer](https://nodemailer.com/about/)
- Node-cron
- React
- [Chart.js](https://www.chartjs.org/)