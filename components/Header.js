import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("--:--");
  const [date, setDate] = useState("---");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(
        now.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19a4.5 4.5 0 1 0 0-9h-1.8A7 7 0 1 0 4 16.9" />
            <path d="M8 19v2M12 19v2M16 19v2" />
            <path d="M20 8.5a3 3 0 0 0-3-3" />
          </svg>
        </div>
        <div>
          <h1>Mausam Info Nepal</h1>
          <p>Live weather · updated every 10 min</p>
        </div>
      </div>
      <div className="clock">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
    </header>
  );
}