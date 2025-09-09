import { useEffect, useState } from "react";

const USER_AGENT = {
  headers: {
    "User-Agent": "(my-weather-app, contact@example.com)", // <- put your app/email here
  },
};
async function getForecast(lat: number, lon: number) {
  const pointsRes = await fetch(
    `https://api.weather.gov/points/${lat},${lon}`,
    { headers: { "User-Agent": "(my-app, contact@example.com)" } }
  );
  const pointsData = await pointsRes.json();

  // Daily & hourly forecast URLs
  const forecastUrl = pointsData.properties.forecast;
  const hourlyUrl = pointsData.properties.forecastHourly;

  const [dailyRes, hourlyRes] = await Promise.all([
    fetch(forecastUrl, {
      headers: { "User-Agent": "(my-app, contact@example.com)" },
    }),
    fetch(hourlyUrl, {
      headers: { "User-Agent": "(my-app, contact@example.com)" },
    }),
  ]);

  const dailyData = await dailyRes.json();
  const hourlyData = await hourlyRes.json();

  return {
    daily: dailyData.properties.periods, // day/night with highs & lows
    hourly: hourlyData.properties.periods, // hourly temps
  };
}

export default function WeatherScreen() {
  const [forecast, setForecast] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getForecast(40.71, -74.01);

      const current = data.hourly[0]; // current hour
      const todayHigh = data.daily[0].temperature; // today’s high
      const tonightLow = data.daily[1].temperature; // tonight’s low

      console.log("Current:", current.temperature, current.temperatureUnit);
      console.log("High:", todayHigh, data.daily[0].temperatureUnit);
      console.log("Low:", tonightLow, data.daily[1].temperatureUnit);
    }

    fetchData();
  }, []);
}
