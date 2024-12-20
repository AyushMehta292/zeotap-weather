# Zeotap Weather Application

## Overview

The **Zeotap Weather Application** is a **React-based weather dashboard** that fetches and visualizes weather data for selected cities. It tracks real-time metrics such as temperature and weather conditions, alerts users if thresholds are exceeded, and sends email notifications.

---

## Features

- **Real-Time Weather Data**: Fetches current weather conditions from OpenWeatherMap API.
- **Related BackGround Image**: Displays a background image based on the weather condition.
- **Alerts with Email Notifications**: Notifies users when temperature thresholds are crossed.
- **Interactive Charts**: Visualizes alert data with Chart.js.
- **City Management**: Users can add or remove cities for tracking.
- **Persistent User Settings**: Stores preferences such as email, cities, and thresholds using local storage.
- **Responsive Design**: TailwindCSS ensures the app looks good on all devices.

---

## Components and Libraries Used

1. **React Hooks**:
   - `useState`: Manages local component state.
   - `useEffect`: Manages side effects, like fetching weather data or starting intervals.
2. **Details Component**:
   - Displays the weather data fetched from the API.
3. **ToastContainer from React-Toastify**:
   - Displays notifications for data fetching events.
4. **getFormattedWeatherData Function**:
   - Fetches weather data from the OpenWeather API, formats it, and returns the results.
5. **Luxon Library**:
   - Used for timezone handling and formatting timestamps.
6. **OpenWeather API**:
   - Provides weather data including temperature, humidity, wind speed, etc.

---

## Dependencies

Below are the key dependencies required for the project. Refer to `package.json` for complete details:

- **React**: ^18.3.1 - Frontend framework
- **Axios**: ^1.7.7 - HTTP requests
- **React-Toastify**: ^9.0.2 - Toast notifications
- **Chart.js** & **react-chartjs-2**: ^4.4.5 / ^5.2.0 - Charting library
- **Luxon**: ^2.4.0 - For handling time and date formatting
- **EmailJS Browser**: ^4.4.1 - Email service integration
- **TailwindCSS**: ^3.4.14 - CSS utility framework

---

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** or **yarn** (for dependency management)
3. **Vite** (for running frontend)

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AyushMehta292/zeotap-weather.git
   cd zeotap-weather
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a **`.env`** file in the root directory with the following content:

   ```plaintext
   VITE_APP_API_URL="https://api.openweathermap.org/data/2.5"
   VITE_APP_API_KEY=<Your_OpenWeather_API_Key>
   VITE_APP_USER_API_ID=<Your_EmailJS_User_ID>
   VITE_APP_EMAIL_SERVICE_ID=<Your_EmailJS_Service_ID>
   VITE_APP_TEMPLATE_ID=<Your_EmailJS_Template_ID>
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## Note

The forecast weather functionality could not be implemented as OpenWeather has made it a paid feature under their OneCall API.

## API Configuration

- **VITE_APP_API_URL**: Base URL for the OpenWeatherMap API.
- **VITE_APP_API_KEY**: Your API key from [OpenWeatherMap](https://openweathermap.org/).
- **VITE_APP_USER_API_ID**: User ID for EmailJS, required for email notifications.
- **VITE_APP_EMAIL_SERVICE_ID**: EmailJS Service ID for sending emails.
- **VITE_APP_TEMPLATE_ID**: EmailJS Template ID used for email templates.

The `.env` file ensures sensitive environment variables are not checked into version control and remain secure on your local machine.

---

## Performance Considerations

- **Lazy Loading**: Components like charts can be loaded lazily to reduce the initial load time.
- **Batch API Calls**: If multiple cities are tracked, batch API requests can reduce network overhead.
- **Optimized State Updates**: React’s `useEffect` and `useState` are used to ensure efficient re-renders.
- **Production Build**: Use `npm run build` to generate optimized static files for faster loading in production environments.

---

## Security Considerations

- **Environment Variables**: Sensitive API keys and user IDs are stored in `.env.local`, preventing accidental exposure.
- **HTTPS**: Ensure the application and API requests are served over HTTPS to avoid data interception.
- **Access Control**: EmailJS and other third-party services should have secure API configurations with limited access.
- **Input Validation**: All user inputs are validated to prevent misuse (e.g., injection attacks).
- **Dependency Management**: Keep dependencies up-to-date to avoid vulnerabilities from outdated libraries.

---

## Design Choices

1. **Component-based Architecture**: Modular components for maintainability and scalability.
2. **Local Storage Integration**: User settings are persisted across sessions for a better UX.
3. **Interactive Alerts**: Notifications inform users about temperature exceedances dynamically.
4. **Responsive Design**: TailwindCSS ensures the app looks good on all devices.

---

## Error Handling

- **API Errors**: Logs errors to the console and displays toast notifications to the user.
- **Invalid Inputs**: Prevents invalid or duplicate entries for cities and settings.
- **Email Service Errors**: Displays a toast if sending emails via EmailJS fails.

---

## Future Improvements

- **Forecast Data**: Add support for hourly and 7-day forecasts.
- **User Authentication**: Allow users to save preferences across devices.

---

This README provides a comprehensive guide to setting up, running, and understanding the Zeotap Weather Application. If you encounter any issues or need further assistance, feel free to reach out.