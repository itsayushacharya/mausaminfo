import {
  cToF,
  mpsToKmph,
  degToDirection,
  formatTimeFromUnix,
} from "../lib/weatherUtils";

export default function StatsGrid({ data, unit }) {
  if (!data) {
    return (
      <>
        <StatCard icon="🌡" label="Feels like" value="--" extra="Perceived temp" />
        <StatCard icon="💧" label="Humidity" value="--" extra="Relative" />
        <StatCard icon="🌬" label="Wind" value="--" extra="--" />
        <StatCard icon="📊" label="Pressure" value="--" extra="Atmospheric" />
        <StatCard icon="🌅" label="Sunrise" value="--" extra="Local time" />
        <StatCard icon="🌇" label="Sunset" value="--" extra="Local time" />
      </>
    );
  }

  const { main, wind = {}, sys = {}, timezone = 0 } = data;
  const unitLabel = unit === "metric" ? "°C" : "°F";

  const feels =
    unit === "metric"
      ? Math.round(main.feels_like)
      : Math.round(cToF(main.feels_like));

  const windSpeed = mpsToKmph(wind.speed || 0).toFixed(1) + " km/h";
  const windDir = degToDirection(wind.deg);

  // Humidity and pressure percent (for bar width)
  const humidityPct = Math.min(main.humidity, 100);
  const pressurePct = Math.min(
    Math.max(((main.pressure - 950) / (1050 - 950)) * 100, 0),
    100
  );

  return (
    <>
      <StatCard
        icon="🌡"
        label="Feels like"
        value={`${feels}${unitLabel}`}
        extra="Perceived temp"
      />
      <StatCard
        icon="💧"
        label="Humidity"
        value={`${main.humidity}%`}
        extra="Relative"
        barPct={humidityPct}
      />
      <StatCard
        icon="🌬"
        label="Wind"
        value={windSpeed}
        extra={`Dir: ${windDir}${wind.deg != null ? ` (${wind.deg}°)` : ""}`}
      />
      <StatCard
        icon="📊"
        label="Pressure"
        value={`${main.pressure}`}
        extra="hPa · atmospheric"
        barPct={pressurePct}
      />
      <StatCard
        icon="🌅"
        label="Sunrise"
        value={formatTimeFromUnix(sys.sunrise, timezone)}
        extra="Local time"
      />
      <StatCard
        icon="🌇"
        label="Sunset"
        value={formatTimeFromUnix(sys.sunset, timezone)}
        extra="Local time"
      />
    </>
  );
}

function StatCard({ icon, label, value, extra, barPct }) {
  return (
    <article className="stat-card">
      <div className="icon">{icon}</div>
      <div>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
        <div className="extra">{extra}</div>
        {barPct != null && (
          <div className="bar">
            <div style={{ width: `${barPct}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}