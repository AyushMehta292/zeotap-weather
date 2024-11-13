/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { lazy, Suspense } from "react";
import { formatToLocalTime, iconUrlFromCode } from "../services/weatherService";
import TopButtons from "./TopButtons";
import Inputs from "./Inputs";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { IoWaterOutline } from "react-icons/io5";
import { FiWind, FiSunrise, FiSunset } from "react-icons/fi";

// Lazy load Summary and Charts components
const Summary = lazy(() => import("./Summary"));
const Charts = lazy(() => import("./Charts"));

// Import weather icons
import clearIcon from "../assets/images/clear.png";
import cloudsIcon from "../assets/images/clouds.png";
import drizzleIcon from "../assets/images/drizzle.png";
import mistIcon from "../assets/images/mist.png";
import rainIcon from "../assets/images/rain.png";
import snowIcon from "../assets/images/snow.png";

// Import background images for day and night
import clearDayBg from "../assets/images/wall/day/sunny.jpg";
import cloudsDayBg from "../assets/images/wall/day/cloud.jpg";
import drizzleDayBg from "../assets/images/wall/day/rain.jpg";
import mistDayBg from "../assets/images/wall/day/cloud.jpg";
import rainDayBg from "../assets/images/wall/day/rain.jpg";
import snowDayBg from "../assets/images/wall/day/snow.jpg";
import clearNightBg from "../assets/images/wall/night/sunny.jpg";
import cloudsNightBg from "../assets/images/wall/night/cloud.jpg";
import drizzleNightBg from "../assets/images/wall/night/rain.jpg";
import mistNightBg from "../assets/images/wall/night/cloud.jpg";
import rainNightBg from "../assets/images/wall/night/rain.jpg";
import snowNightBg from "../assets/images/wall/night/snow.jpg";

const Details = ({ weatherData, units, setQuery, setUnits }) => {
  const getBackgroundImage = (details, dt, sunrise, sunset) => {
    const isDaytime = dt >= sunrise && dt <= sunset;
    const backgrounds = {
      Clear: isDaytime ? clearDayBg : clearNightBg,
      Clouds: isDaytime ? cloudsDayBg : cloudsNightBg,
      Drizzle: isDaytime ? drizzleDayBg : drizzleNightBg,
      Rain: isDaytime ? rainDayBg : rainNightBg,
      Snow: isDaytime ? snowDayBg : snowNightBg,
      Mist: isDaytime ? mistDayBg : mistNightBg,
      Fog: isDaytime ? mistDayBg : mistNightBg,
      Haze: isDaytime ? mistDayBg : mistNightBg,
    };
    return backgrounds[details] || (isDaytime ? clearDayBg : clearNightBg);
  };

  const renderCityWeather = (cityKey, data) => {
    const {
      temp,
      feels_like,
      temp_min,
      temp_max,
      humidity,
      speed,
      sunrise,
      sunset,
      timezone,
      details,
      icon,
      name,
      country,
      dt,
    } = data;
    // console.log("icon",icon, " details", details);

    const backgroundImage = getBackgroundImage(details, dt, sunrise, sunset);

    return (
      <div
        key={cityKey}
        className="my-8 rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-6 bg-gray-800 bg-opacity-50">
          <div className="text-center">
            <p className="text-white text-xl font-extralight">
              {formatToLocalTime(dt, timezone)}
            </p>
            <p className="text-white text-3xl font-semibold mt-2">{`${name}, ${country}`}</p>
            <p className="text-cyan-300 text-xl my-2">{details}</p>
          </div>

          <div className="flex items-center justify-between space-x-4 mx-5 my-6 ">
          <div className="invisible">
              <p className="text-5xl text-white font-semibold">{`${temp.toFixed()}°`}</p>
              <div className="flex flex-col space-y-2 mt-3 text-white">
                <div className="flex items-center text-sm">
                  <FaTemperatureHigh size={18} className="mr-2" />
                  Feels like:
                  <span className="ml-2 font-medium">{`${feels_like.toFixed()}°`}</span>
                </div>
                <div className="flex items-center text-sm">
                  <IoWaterOutline size={18} className="mr-2" />
                  Humidity:
                  <span className="ml-2 font-medium">{`${humidity.toFixed()}%`}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiWind size={18} className="mr-2" />
                  Wind:
                  <span className="ml-2 font-medium">{`${speed.toFixed()} km/h`}</span>
                </div>
              </div>
            </div>
            {/* Weather Icon */}
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather icon" className="w-30 h-30 rounded-full bg-white bg-opacity-30 " />

            {/* Main Temperature & Details */}
            <div className="">
              <p className="text-5xl text-white font-semibold">{`${temp.toFixed()}°`}</p>
              <div className="flex flex-col space-y-2 mt-3 text-white">
                <div className="flex items-center text-sm">
                  <FaTemperatureHigh size={18} className="mr-2" />
                  Feels like:
                  <span className="ml-2 font-medium">{`${feels_like.toFixed()}°`}</span>
                </div>
                <div className="flex items-center text-sm">
                  <IoWaterOutline size={18} className="mr-2" />
                  Humidity:
                  <span className="ml-2 font-medium">{`${humidity.toFixed()}%`}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiWind size={18} className="mr-2" />
                  Wind:
                  <span className="ml-2 font-medium">{`${speed.toFixed()} km/h`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 text-white text-sm mt-4">
            <div className="flex items-center space-x-2">
              <FiSunrise />
              <span>
                Rise:
                <span className="ml-1 font-medium">
                  {formatToLocalTime(sunrise, timezone, "hh:mm a")}
                </span>
              </span>
            </div>
            <span>|</span>
            <div className="flex items-center space-x-2">
              <FiSunset />
              <span>
                Set:
                <span className="ml-1 font-medium">
                  {formatToLocalTime(sunset, timezone, "hh:mm a")}
                </span>
              </span>
            </div>
            <span>|</span>
            <div className="flex items-center space-x-2">
              <FaTemperatureHigh />
              <span>
                High:
                <span className="ml-1 font-medium">{`${temp_max.toFixed()}°`}</span>
              </span>
            </div>
            <span>|</span>
            <div className="flex items-center space-x-2">
              <FaTemperatureLow />
              <span>
                Low:
                <span className="ml-1 font-medium">{`${temp_min.toFixed()}°`}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isSingleCity = weatherData.hasOwnProperty("lat");

  return (
    <div className="mx-auto mt-4 py-5 px-16 h-fit shadow-gray-400 bg-gradient-to-br from-slate-200 to-blue-400">
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {isSingleCity
        ? renderCityWeather(weatherData.name, weatherData)
        : Object.keys(weatherData).map((city) =>
            renderCityWeather(city, weatherData[city])
          )}

      <Suspense fallback={<div>Loading Summary...</div>}>
        <Summary weatherData={weatherData} units={units} />
      </Suspense>

      <Suspense fallback={<div>Loading Charts...</div>}>
        <Charts units={units} />
      </Suspense>
    </div>
  );
};

export default Details;