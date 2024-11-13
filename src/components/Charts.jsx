import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

const Charts = () => {
  const [weatherSummaries, setWeatherSummaries] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Retrieve data from localStorage on component mount
  useEffect(() => {
    const storedWeather =
      JSON.parse(localStorage.getItem("weatherSummaries")) || [];
    const lastData = storedWeather.slice(-6 * 15); // Retrieve last 6 * 15 entries

    setWeatherSummaries(lastData.length ? lastData : []);

    const storedToken = JSON.parse(localStorage.getItem("userToken"));
    setAlerts(storedToken?.alerts || []);
  }, []);

  // If no weather data is available
  if (weatherSummaries.length === 0) {
    return <p className="text-center text-xl">Not enough data for charts</p>;
  }

  // Prepare datasets for the line charts (Temperature Trends)
  const cities = [...new Set(weatherSummaries.map((summary) => summary.city))];

  // Function to generate consistent colors for each city
  const getColor = (city) => {
    const colors = {
      Delhi: "#FF6384",
      Mumbai: "#36A2EB",
      Chennai: "#FFCE56",
      Bengaluru: "#4BC0C0",
      Kolkata: "#9966FF",
      Hyderabad: "#FF9F40",
    };
    return colors[city] || "#000000";
  };

  const generateLineChartData = (type) => {
    const limitedWeatherSummaries = cities.reduce((acc, city) => {
      const cityEntries = weatherSummaries
        .filter((summary) => summary.city === city)
        .slice(0, 15); // Take only the first 15 entries for each city
      return [...acc, ...cityEntries];
    }, []);

    const labels = limitedWeatherSummaries
      .slice(0, 15)
      .map((_, index) => `Entry ${index + 1}`);

    return {
      labels: labels, // Only 15 labels for the x-axis
      datasets: cities.map((city) => ({
        label: `${city} ${type}`,
        data: limitedWeatherSummaries
          .filter((summary) => summary.city === city)
          .slice(0, 15) // Ensure only 15 data points per city
          .map((summary) => summary[type]),
        borderColor: getColor(city),
        fill: false,
      })),
    };
  };

  // Group alerts by city and sum their counts
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (acc[alert.cities]) {
      acc[alert.cities] += alert.count;
    } else {
      acc[alert.cities] = alert.count;
    }
    return acc;
  }, {});

  // Prepare the data for the chart
  const barChartData = {
    labels: Object.keys(groupedAlerts), // Cities as labels on the x-axis
    datasets: [
      {
        label: "Alert Counts",
        data: Object.values(groupedAlerts), // Counts as data on the y-axis
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="my-8 max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Charts</h2>
  
      {/* Line Chart: Avg Temperature */}
      <div className="mb-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Avg Temperature Trend
        </h3>
        <div style={{ height: "350px" }}>
          <Line
            data={generateLineChartData("tempAvg")}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "rgba(200, 200, 200, 0.2)" } },
              },
              plugins: {
                legend: { labels: { color: "#4A5568", font: { size: 14 } } },
                tooltip: {
                  backgroundColor: "#3182CE",
                  bodyColor: "#ffffff",
                  titleColor: "#ffffff",
                  borderColor: "#2B6CB0",
                  borderWidth: 1,
                },
              },
            }}
          />
        </div>
      </div>
  
      {/* Line Chart: Min Temperature */}
      <div className="mb-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Min Temperature Trend
        </h3>
        <div style={{ height: "350px" }}>
          <Line
            data={generateLineChartData("tempMin")}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "rgba(200, 200, 200, 0.2)" } },
              },
              plugins: {
                legend: { labels: { color: "#4A5568", font: { size: 14 } } },
                tooltip: {
                  backgroundColor: "#48BB78",
                  bodyColor: "#ffffff",
                  titleColor: "#ffffff",
                  borderColor: "#38A169",
                  borderWidth: 1,
                },
              },
            }}
          />
        </div>
      </div>
  
      {/* Line Chart: Max Temperature */}
      <div className="mb-12 bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Max Temperature Trend
        </h3>
        <div style={{ height: "350px" }}>
          <Line
            data={generateLineChartData("tempMax")}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "rgba(200, 200, 200, 0.2)" } },
              },
              plugins: {
                legend: { labels: { color: "#4A5568", font: { size: 14 } } },
                tooltip: {
                  backgroundColor: "#F56565",
                  bodyColor: "#ffffff",
                  titleColor: "#ffffff",
                  borderColor: "#E53E3E",
                  borderWidth: 1,
                },
              },
            }}
          />
        </div>
      </div>
  
      {/* Bar Chart: Alerts by City */}
      {/* <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Alerts by City
        </h3>
        {alerts.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            Create alerts before seeing alert trends
          </p>
        ) : (
          <div style={{ height: "350px" }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { color: "rgba(200, 200, 200, 0.2)" } },
                },
                plugins: {
                  legend: { labels: { color: "#4A5568", font: { size: 14 } } },
                  tooltip: {
                    backgroundColor: "#63B3ED",
                    bodyColor: "#ffffff",
                    titleColor: "#ffffff",
                    borderColor: "#3182CE",
                    borderWidth: 1,
                  },
                },
              }}
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Charts;
