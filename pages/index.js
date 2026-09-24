import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import QuickCities from "../components/QuickCities";
import WeatherMain from "../components/WeatherMain";
import StatsGrid from "../components/StatsGrid";
import HourlyForecast from "../components/HourlyForecast";

const API_KEY = "fa6b49cba5a0d22bdc435a0dfa36dd61";

// Map OpenWeatherMap condition → theme class
function getTheme(data) {
  if (!data) return "theme-night";

  const id = data.weather?.[0]?.id || 800;
  const tz = data.timezone || 0;
  const localHour = new Date(
    (Date.now() / 1000 + tz - new Date().getTimezoneOffset() * 60) * 1000
  ).getUTCHours();
  const isNight = localHour < 6 || localHour >= 19;

  if (isNight) return "theme-night";
  if (id >= 200 && id < 300) return "theme-thunder";
  if (id >= 300 && id < 600) return "theme-rain";
  if (id >= 600 && id < 700) return "theme-snow";
  if (id >= 700 && id < 800) return "theme-clouds";
  if (id === 800) return "theme-clear";
  return "theme-clouds";
}

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [currentUnit, setCurrentUnit] = useState("metric");
  const [cityInput, setCityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastCity, setLastCity] = useState("Kathmandu");

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError("");
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )},NP&units=metric&appid=${API_KEY}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
          )},NP&units=metric&appid=${API_KEY}`
        ),
      ]);
      const wData = await wRes.json();
      const fData = await fRes.json();

      if (wData.cod !== 200) throw new Error(wData.message || "City not found");

      setWeatherData(wData);
      setForecastData(fData);
      setLastCity(city);
    } catch (err) {
      setError("City not found or network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError("");
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ),
      ]);
      const wData = await wRes.json();
      const fData = await fRes.json();

      if (wData.cod !== 200) throw new Error("Location error");

      setWeatherData(wData);
      setForecastData(fData);
      setLastCity(wData.name);
    } catch {
      setError("Unable to fetch location weather.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => fetchWeather(cityInput.trim() || "Kathmandu");

  const handleQuickCity = (city) => {
    setCityInput(city);
    fetchWeather(city);
  };

  const handleGeo = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => setError("Location access denied.")
    );
  };

  // Initial load
  useEffect(() => {
    fetchWeather("Kathmandu");
  }, [fetchWeather]);

  // Auto refresh every 10 minutes
  useEffect(() => {
    const id = setInterval(() => fetchWeather(lastCity), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [lastCity, fetchWeather]);

  // Apply weather theme to <body>
  useEffect(() => {
    const theme = getTheme(weatherData);
    document.body.className = theme;
  }, [weatherData]);

  return (
    <>
      <Head>
        <title>Mausam Info Nepal · Live Weather</title>
        <meta name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
        <meta
          name="description"
          content="Real-time weather metrics for cities across Nepal"

        />
        <link rel="icon" type="image/png" href="https://uxwing.com/wp-content/themes/uxwing/download/weather/weather-icon.png"></link>
      </Head>


      <div className="container">
        <div className="weather-app">
          <Header />

          <Toolbar
            cityInput={cityInput}
            setCityInput={setCityInput}
            onSearch={handleSearch}
            onGeo={handleGeo}
            currentUnit={currentUnit}
            onUnitChange={setCurrentUnit}
          />

          <QuickCities onSelect={handleQuickCity} />

          {loading && (
            <div className="loading">
              <span className="spinner" />
              Updating weather data...
            </div>
          )}
          {error && <div className="error">{error}</div>}

          <div className="bento">
            <WeatherMain data={weatherData} unit={currentUnit} />
            <StatsGrid data={weatherData} unit={currentUnit} />
          </div>

          <HourlyForecast forecast={forecastData} unit={currentUnit} />
        </div>
      </div>
    </>
  );
}