import { fetchWeatherApi } from "openmeteo";
import { useEffect } from "react";

async function loadWeatherData() {
  const params = {
    latitude: 52.52,
    longitude: 13.41,
    hourly: "temperature_2m",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

  console.log(
    `\nCoordinates: ${latitude}°N ${longitude}°E`,
    `\nElevation: ${elevation}m asl`,
    `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
  );

  return response;
}

useEffect(() => {
  async function fetchData() {
    const response = await loadWeatherData();
    const hourly = response.hourly();
    const utcOffsetSeconds = response.utcOffsetSeconds();
    if (!hourly) {
      console.warn("No hourly data found");
      return;
    }

    const weatherData = {
      hourly: {
        time: [
          ...Array(
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval()
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        temperature_2m: hourly.variables(0).valuesArray(),
      },
    };

    console.log("\nHourly data", weatherData.hourly);
  }

  fetchData();
}, []);
