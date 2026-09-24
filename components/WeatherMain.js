import { cToF } from "../lib/weatherUtils";

export default function WeatherMain({ data, unit }) {
  if (!data) {
    return (
      <div className="hero-card">
        <div className="hero-top">
          <div>
            <div className="hero-location">
              <span className="dot" /> Loading...
            </div>
            <div className="hero-condition">Fetching weather data</div>
          </div>
        </div>
        <div className="hero-temp">
          <span className="number">--</span>
          <span className="unit">°C</span>
        </div>
        <div className="hero-meta">Please wait...</div>
      </div>
    );
  }

  const { main, weather, timezone, name } = data;
  const condition = weather?.[0];
  const unitLabel = unit === "metric" ? "C" : "F";

  const convert = (v) =>
    unit === "metric" ? Math.round(v) : Math.round(cToF(v));

  const temp = convert(main.temp);
  const feels = convert(main.feels_like);
  const min = convert(main.temp_min);
  const max = convert(main.temp_max);

  const localHour = new Date(
    (Date.now() / 1000 + (timezone || 0) - new Date().getTimezoneOffset() * 60) *
      1000
  ).getUTCHours();
  const isNight = localHour < 6 || localHour >= 19;

  return (
    <div className="hero-card">
      <div className="hero-top">
        <div>
          <div className="hero-location">
            <span className="dot" />
            {name}, Nepal
          </div>
          <div className="hero-condition">
            {condition?.description} · {isNight ? "Night" : "Day"}
          </div>
        </div>
        {condition?.icon && (
          <img
            className="hero-icon"
            src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
            alt={condition.description || "Weather"}
          />
        )}
      </div>

      <div className="hero-temp">
        <span className="number">{temp}</span>
        <span className="unit">
          °<span className="unit-letter">{unitLabel}</span>
        </span>
      </div>

      <div className="hero-meta">
        <span>
          Feels like <strong>{feels}°{unitLabel}</strong>
        </span>
        <span>
          H: <strong>{max}°{unitLabel}</strong>
        </span>
        <span>
          L: <strong>{min}°{unitLabel}</strong>
        </span>
      </div>
    </div>
  );
}