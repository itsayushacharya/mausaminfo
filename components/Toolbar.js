export default function Toolbar({
  cityInput,
  setCityInput,
  onSearch,
  onGeo,
  currentUnit,
  onUnitChange,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="toolbar">
      <div className="search">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search Nepal city (e.g. Kathmandu)"
          aria-label="Search city"
        />
        <button className="btn" onClick={onSearch} aria-label="Search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <button className="btn secondary" onClick={onGeo}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Location
      </button>

      <div className="unit-toggle" aria-label="Temperature unit">
        <button
          type="button"
          className={currentUnit === "metric" ? "active" : ""}
          onClick={() => onUnitChange("metric")}
        >
          °C
        </button>
        <button
          type="button"
          className={currentUnit === "imperial" ? "active" : ""}
          onClick={() => onUnitChange("imperial")}
        >
          °F
        </button>
      </div>
    </div>
  );
}