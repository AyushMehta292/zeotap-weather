/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const Summary = ({ weatherData, units }) => {
  const [dailySummary, setDailySummary] = useState(null);
  const [newCity, setNewCity] = useState("");
  const [userToken, setUserToken] = useState({
    email: "",
    threshold: 35,
    unit: "metric",
    cities: [],
    consecutiveExceed: 0,
    alerts: [],
  });

  const USER_API_ID = import.meta.env.VITE_APP_USER_API_ID || "";
  const EMAIL_SERVICE_ID = import.meta.env.VITE_APP_EMAIL_SERVICE_ID || "";
  const TEMPLATE_ID = import.meta.env.VITE_APP_TEMPLATE_ID || "";

  // Load user settings on component mount
  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("userToken"));
    if (storedToken) setUserToken(storedToken);
  }, []);

  // Recalculate summary whenever weather data changes
  useEffect(() => {
    if (weatherData) {
      const data = Array.isArray(weatherData) ? weatherData : [weatherData];
      calculateDailySummary(data);
    }
  }, [weatherData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserToken((prev) => ({ ...prev, [name]: value, consecutiveExceed: 0 }));
  };

  const handleSave = () => {
    const trimmedCity = newCity.trim();
    if (trimmedCity && !userToken.cities.includes(trimmedCity)) {
      const updatedToken = {
        ...userToken,
        cities: [...userToken.cities, trimmedCity],
      };
      setUserToken(updatedToken);
      storeUserSettings(updatedToken);
      toast.success(`City added successfully: ${trimmedCity}`);
    } else {
      storeUserSettings(userToken);
      toast.success("Settings saved successfully!");
    }
    setNewCity("");
  };

  const storeUserSettings = (updatedToken) => {
    localStorage.setItem("userToken", JSON.stringify(updatedToken));
  };

  const calculateDailySummary = (data) => {
    const summaries = data.map(createCitySummary);
    setDailySummary(summaries);
    storeDailySummary(summaries);
    checkThresholds(summaries);
  };

  const createCitySummary = (data) => {
    const { name: city, temp, temp_min, temp_max, details } = data;
    const unitSymbol = units === "metric" ? "°C" : "°F";
    return {
      date: new Date().toLocaleDateString(),
      city,
      tempAvg: parseFloat(temp.toFixed(2)),
      tempMax: temp_max,
      tempMin: temp_min,
      dominantCondition: details,
      unit: unitSymbol,
    };
  };

  const storeDailySummary = (summaries) => {
    const existingSummaries =
      JSON.parse(localStorage.getItem("weatherSummaries")) || [];
    existingSummaries.push(...summaries);
    localStorage.setItem("weatherSummaries", JSON.stringify(existingSummaries));
  };

  const checkThresholds = (summaries) => {
    const storedToken = JSON.parse(localStorage.getItem("userToken"));
    if (!storedToken) return;

    const threshold = convertTemperature(
      storedToken.threshold,
      storedToken.unit,
      units
    );

    const exceedCities = summaries.filter(
      (summary) =>
        (!storedToken.cities.length ||
          storedToken.cities.includes(summary.city)) &&
        summary.tempAvg > threshold
    );

    if (exceedCities.length > 0) {
      const newConsecutiveExceed = storedToken.consecutiveExceed + 1;

      const updatedAlerts = exceedCities.reduce(
        (alerts, city) => {
          const alertIndex = alerts.findIndex(
            (alert) => alert.cities === city.city
          );
          if (alertIndex >= 0) {
            alerts[alertIndex].count += 1;
          } else {
            alerts.push({
              cities: city.city,
              count: 1,
              timestamp: new Date().toISOString(),
            });
          }
          return alerts;
        },
        [...storedToken.alerts]
      );

      setUserToken((prev) => ({
        ...prev,
        consecutiveExceed: newConsecutiveExceed,
        alerts: updatedAlerts,
      }));

      if (newConsecutiveExceed >= 2) {
        sendEmailAlert(exceedCities);
      } else {
        toast.warn(
          `Temperature exceeded in ${exceedCities
            .map((city) => city.city)
            .join(", ")}. Exceedance count: ${newConsecutiveExceed}`
        );
      }

      storeUserSettings({
        ...storedToken,
        consecutiveExceed: newConsecutiveExceed,
        alerts: updatedAlerts,
      });
    }
  };

  const convertTemperature = (value, fromUnit, toUnit) => {
    return fromUnit === toUnit
      ? value
      : fromUnit === "metric"
      ? (value * 9) / 5 + 32
      : ((value - 32) * 5) / 9;
  };

  const sendEmailAlert = async (exceedCities) => {
    const cityNames = exceedCities.map((city) => city.city).join(", ");

    const templateParams = {
      to_email: userToken.email,
      city_names: cityNames,
    };

    if (!validateEmail(userToken.email)) {
      toast.error("Invalid email address.");
      return;
    }

    try {
      await emailjs.send(
        EMAIL_SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        USER_API_ID
      );
      toast.success("Email alert sent successfully!");
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("Failed to send email alert.");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="my-8 max-w-4xl mx-auto px-4">
      <h2 className="text-center text-4xl font-bold text-blue-400 mb-8 bg-white mx-16 rounded-lg p-1 shadow-2xl bg-opacity-30">
        Daily Weather Summary
      </h2>
  
      <div className="flex flex-col items-center mb-6">
        <input
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Enter city to add"
          className="mb-2 p-3 rounded-lg bg-gray-200 w-1/2 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="number"
          name="threshold"
          value={userToken.threshold}
          onChange={handleInputChange}
          placeholder="Enter temperature threshold"
          className="mb-2 p-3 rounded-lg bg-gray-200 w-1/2 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="email"
          name="email"
          value={userToken.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="mb-2 p-3 rounded-lg bg-gray-200 w-1/2 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          className="bg-cyan-600 text-white px-6 py-2 rounded-full mt-4 shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
  
      {!dailySummary ? (
        <div className="text-center">
          <button
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-md mt-4 transition-all hover:opacity-90 transform hover:scale-105"
            onClick={() => calculateDailySummary(weatherData)}
          >
            Generate Daily Summary
          </button>
        </div>
      ) : (
        dailySummary.map((summary, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white p-6 mb-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <span className="mr-2">{summary.city}</span> 
              <span className="text-base text-gray-400">{summary.date}</span>
            </h3>
            <p className="text-lg">
              <strong className="text-cyan-400">Avg Temp: </strong>
              {summary.tempAvg} {summary.unit}
            </p>
            <p className="text-lg">
              <strong className="text-cyan-400">Max Temp: </strong>
              {summary.tempMax} {summary.unit}
            </p>
            <p className="text-lg">
              <strong className="text-cyan-400">Min Temp: </strong>
              {summary.tempMin} {summary.unit}
            </p>
            <p className="text-lg">
              <strong className="text-cyan-400">Condition: </strong>
              {summary.dominantCondition}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Summary;
