import { cToF } from "../lib/weatherUtils";

export default function HourlyForecast({ forecast, unit }) {
  if (!forecast || !forecast.list) return null;

  const unitLabel = unit === "metric" ? "°" : "°";
  const convert = (v) =>
    unit === "metric" ? Math.round(v) : Math.round(cToF(v));

  // Next 12 entries (3-hour intervals = 36 hours)
  const hours = forecast.list.slice(0, 12);

  return (
    <div className="hourly">
      <div className="hourly-title">Next 36 hours</div>
      <div className="hourly-strip">
        {hours.map((h, i) => {
          const time = new Date(h.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const pop = Math.round((h.pop || 0) * 100);
          const icon = h.weather?.[0]?.icon;

          return (
            <div className="hour-item" key={i}>
              <div className="h-time">{time}</div>
              {icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt=""
                />
              )}
              <div className="h-temp">
                {convert(h.main.temp)}
                {unitLabel}
              </div>
              {pop > 0 && <div className="h-pop">💧{pop}%</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}