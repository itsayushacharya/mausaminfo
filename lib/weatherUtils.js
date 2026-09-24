export function cToF(c) {
  return (c * 9) / 5 + 32;
}

export function mpsToKmph(mps) {
  return mps * 3.6;
}

export function degToDirection(deg) {
  if (deg == null || isNaN(deg)) return "--";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round((deg % 360) / 45) % 8];
}

export function formatTimeFromUnix(unix, timezoneOffset) {
  if (!unix) return "--";
  const date = new Date((unix + timezoneOffset) * 1000);
  const match = date.toUTCString().match(/\d{2}:\d{2}/);
  return match ? match[0] : "--";
}