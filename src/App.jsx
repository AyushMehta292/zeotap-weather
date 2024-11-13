import { useEffect, useState } from "react";
import Details from "./components/Details";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getFormattedWeatherData from "./services/weatherService";

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_APP_API_KEY;
if (!API_KEY) {
  toast.error(`Weather API key not found in environment variables`);
  throw new Error("Weather API key not found in environment variables");
} else {
  toast.success("Weather API key found in environment variables");
}

const metros = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

const App = () => {
  const [query, setQuery] = useState({ q: "" });
  const [units, setUnits] = useState("metric");
  const [weatherData, setWeatherData] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(5); // Default 5 minutes

  // Convert polling interval from minutes to milliseconds
  const intervalInMilliseconds = pollingInterval * 60 * 1000;

  const startPollingWeatherData = () => {
    const fetchWeatherForMetros = async () => {
      setLoading(true);

      try {
        const weatherPromises = metros.map((city) =>
          getFormattedWeatherData({ q: city, units })
        );
        const data = await Promise.all(weatherPromises);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather for metros:", error);
        toast.error("Failed to fetch weather data for some cities.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForMetros(); // Initial fetch

    const interval = setInterval(fetchWeatherForMetros, intervalInMilliseconds);
    return () => clearInterval(interval); // Cleanup on unmount
  };

  useEffect(() => {
    startPollingWeatherData();
  }, [units, pollingInterval]);

  useEffect(() => {
    if (!query.q && (!query.lat || !query.lon)) return;

    const fetchWeather = async () => {
      const message = query.q
        ? `Fetching weather for ${query.q}`
        : `Fetching weather for coordinates (${query.lat}, ${query.lon})`;
      toast.info(message);

      try {
        const data = await getFormattedWeatherData({ ...query, units });
        setWeather(data);
        toast.success(`Fetched weather for ${data.name}, ${data.country}`);
      } catch (error) {
        console.error("Error fetching weather:", error);
        toast.error("Failed to fetch weather data.");
      }
    };

    fetchWeather();
  }, [query, units]);

  const weatherDetails = weather || weatherData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-900 flex flex-col items-center py-10">
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold  text-center mb-4  text-blue-400 bg-white rounded-lg p-1 shadow-2xl bg-opacity-30">
          ZeotapCLIMATE
        </h1>
        <div className="flex justify-center items-center mb-6">
          <label className="mr-3 font-semibold text-gray-600">
            Polling Interval (minutes):
          </label>
          <input
            type="number"
            value={pollingInterval}
            onChange={(e) => setPollingInterval(Number(e.target.value))}
            className="p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
            min={1}
          />
        </div>

        {loading ? (
          <p className="text-gray-600 text-center text-lg animate-pulse">
            Loading weather data...
          </p>
        ) : (
          <Details
            weatherData={weatherDetails}
            setQuery={setQuery}
            units={units}
            setUnits={setUnits}
          />
        )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        newestOnTop={true}
        toastClassName="rounded-lg shadow-lg bg-indigo-600 text-white font-semibold"
      />
    </div>
  );
};

export default App;