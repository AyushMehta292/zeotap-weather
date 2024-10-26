/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const DailySummary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchDailySummary = async () => {
      try {
        const response = await axios.get('http://localhost:4001/daily-summary');
        setSummaryData(response.data);
        
        const dates = response?.data?.map(item => new Date(item.date).toLocaleDateString());
        const avgTemps = response?.data?.map(item => item.avgTemp);
        const maxTemps = response?.data?.map(item => item.maxTemp);
        const minTemps = response?.data?.map(item => item.minTemp);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Average Temperature (°C)',
              data: avgTemps,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
            {
              label: 'Max Temperature (°C)',
              data: maxTemps,
              borderColor: 'rgba(255,99,132,1)',
              fill: false,
            },
            {
              label: 'Min Temperature (°C)',
              data: minTemps,
              borderColor: 'rgba(54,162,235,1)',
              fill: false,
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching daily summary:", error);
      }
    };

    fetchDailySummary();
  }, []);

  return (
    <div>
      <h2>Daily Weather Summary</h2>
      {
        !chartData &&
        <div>Seraching...</div>
      }
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default DailySummary;
