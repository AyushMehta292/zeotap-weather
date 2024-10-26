// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherData = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('http://localhost:4001/weather');
        setWeatherData(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div>
      <h2>Real-Time Weather Data</h2>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Feels Like (°C)</th>
            <th>Condition</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {weatherData?.map((data, index) => (
            <tr key={index}>
              <td>{data.city}</td>
              <td>{data.temp}</td>
              <td>{data.feels_like}</td>
              <td>{data.main}</td>
              <td>{new Date(data.timestamp * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherData;
