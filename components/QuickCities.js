const CITIES = [
  "Kathmandu",
  "Pokhara",
  "Dharan",
  "Biratnagar",
  "Butwal",
  "Nepalgunj",
  "Birgunj",
];

export default function QuickCities({ onSelect }) {
  return (
    <div className="quick-cities">
      {CITIES.map((city) => (
        <button key={city} onClick={() => onSelect(city)}>
          {city}
        </button>
      ))}
    </div>
  );
}