import {
  cToF,
  mpsToKmph,
  degToDirection,
  formatTimeFromUnix,
} from "../lib/weatherUtils";

/* -- Inline SVG icons -- */
const Icon = {
  Thermometer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  Droplet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Wind: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  ),
  Gauge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14l4-4M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  ),
  Sunrise: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0M12 2v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M8 6l4-4 4 4" />
    </svg>
  ),
  Sunset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0M12 9V2M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M16 5l-4 4-4-4" />
    </svg>
  ),
};

export default function StatsGrid({ data, unit }) {
  if (!data) {
    return (
      <>
        <StatCard icon={<Icon.Thermometer />} label="Feels like" value="--" extra="Perceived temp" />
        <StatCard icon={<Icon.Droplet />} label="Humidity" value="--" extra="Relative" />
        <StatCard icon={<Icon.Wind />} label="Wind" value="--" extra="--" />
        <StatCard icon={<Icon.Gauge />} label="Pressure" value="--" extra="Atmospheric" />
        <StatCard icon={<Icon.Sunrise />} label="Sunrise" value="--" extra="Local time" />
        <StatCard icon={<Icon.Sunset />} label="Sunset" value="--" extra="Local time" />
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

  const humidityPct = Math.min(main.humidity, 100);
  const pressurePct = Math.min(
    Math.max(((main.pressure - 950) / (1050 - 950)) * 100, 0),
    100
  );

  return (
    <>
      <StatCard
        icon={<Icon.Thermometer />}
        label="Feels like"
        value={`${feels}${unitLabel}`}
        extra="Perceived temp"
      />
      <StatCard
        icon={<Icon.Droplet />}
        label="Humidity"
        value={`${main.humidity}%`}
        extra="Relative"
        barPct={humidityPct}
      />
      <StatCard
        icon={<Icon.Wind />}
        label="Wind"
        value={windSpeed}
        extra={`Dir: ${windDir}${wind.deg != null ? ` (${wind.deg}°)` : ""}`}
      />
      <StatCard
        icon={<Icon.Gauge />}
        label="Pressure"
        value={`${main.pressure}`}
        extra="hPa · atmospheric"
        barPct={pressurePct}
      />
      <StatCard
        icon={<Icon.Sunrise />}
        label="Sunrise"
        value={formatTimeFromUnix(sys.sunrise, timezone)}
        extra="Local time"
      />
      <StatCard
        icon={<Icon.Sunset />}
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