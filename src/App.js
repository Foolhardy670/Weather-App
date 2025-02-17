import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "9e8637c8aef2ec775263aa4c9c57b538";

  // Load the last selected city from local storage
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      fetchWeather(savedCity);
      fetchForecast(savedCity);
    }
  }, []);

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setError("City not found. Please try again.");
      setWeatherData(null);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecastData(response.data);
    } catch (err) {
      setForecastData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() === "") return;
    fetchWeather(city);
    fetchForecast(city);
    localStorage.setItem("lastCity", city); 
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className="App">
      <h1>Weather Forecast App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name or zip code"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>
            {weatherData.name}, {weatherData.sys?.country}
          </h2>
          <p>
            {" "}
            <span>Temperature</span>: {weatherData.main?.temp}°C
          </p>
          <p>
            {" "}
            <span>Humidity</span>: {weatherData.main?.humidity}%
          </p>
          <p>
            {" "}
            <span>Wind Speed</span>: {weatherData.wind?.speed} m/s
          </p>
          <p>
            {" "}
            <span>Sunrise</span>: {formatTime(weatherData.sys?.sunrise)}
          </p>
          <p>
            {" "}
            <span>Sunset</span>: {formatTime(weatherData.sys?.sunset)}
          </p>
        </div>
      )}

      {forecastData && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-list">
            {forecastData.list.slice(0, 5).map((item, index) => (
              <div key={index} className="forecast-item">
                <p>
                  {" "}
                  <span>Date</span>: {item.dt_txt}
                </p>
                <p>
                  {" "}
                  <span>Temp</span>: {item.main?.temp}°C
                </p>
                <p>
                  {" "}
                  <span>Humidity</span>: {item.main?.humidity}%
                </p>
                <p>
                  {" "}
                  <span>Wind</span>: {item.wind?.speed} m/s
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
