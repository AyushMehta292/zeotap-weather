/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertTable = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/weather/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div>
      <h2>Weather Alerts</h2>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>City</th>
            <th>Condition</th>
            <th>Alert Message</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index}>
              <td>{new Date(alert.timestamp).toLocaleString()}</td>
              <td>{alert.city}</td>
              <td>{alert.condition}</td>
              <td>{alert.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertTable;
