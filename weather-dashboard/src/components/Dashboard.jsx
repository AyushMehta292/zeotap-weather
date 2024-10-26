/* eslint-disable no-unused-vars */
import React from 'react';
import WeatherData from './WeatherData';
import DailySummary from './DailySummery';
import AlertTable from './AlertTable';

const Dashboard = () => {
  return (
    <div>
      <h1>Weather Monitoring Dashboard</h1>
      <WeatherData />
      {/* <DailySummary /> */}
      <AlertTable />
    </div>
  );
};

export default Dashboard;
