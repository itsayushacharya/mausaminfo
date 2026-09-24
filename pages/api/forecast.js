const API_KEY = "fa6b49cba5a0d22bdc435a0dfa36dd61";

export default async function handler(req, res) {
  const { city, lat, lon } = req.query;

  let url;
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )},NP&units=metric&appid=${API_KEY}`;
  } else {
    return res.status(400).json({ error: "Missing city or coords" });
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
}