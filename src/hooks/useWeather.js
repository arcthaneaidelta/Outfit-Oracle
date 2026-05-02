import { useState, useEffect } from 'react';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const WMO_CODES = {
  0: { label: 'Clear', emoji: '☀️' },
  1: { label: 'Mainly Clear', emoji: '🌤️' },
  2: { label: 'Partly Cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Icy Fog', emoji: '🌫️' },
  51: { label: 'Light Drizzle', emoji: '🌦️' },
  61: { label: 'Light Rain', emoji: '🌧️' },
  63: { label: 'Moderate Rain', emoji: '🌧️' },
  65: { label: 'Heavy Rain', emoji: '🌧️' },
  71: { label: 'Light Snow', emoji: '🌨️' },
  73: { label: 'Moderate Snow', emoji: '❄️' },
  75: { label: 'Heavy Snow', emoji: '❄️' },
  80: { label: 'Showers', emoji: '🌦️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
};

// INITIAL STATE to prevent "null" crashes
const initialState = { 
  temp: 20, 
  condition: 'Loading...', 
  emoji: '🌡️', 
  city: 'Loading...' 
};

export function useWeather(city) {
  const [weather, setWeather] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const geoRes = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          setError('City not found');
          setWeather({ temp: 20, condition: 'City Not Found', emoji: '📍', manual: true });
          return;
        }

        const { latitude, longitude } = geoData.results[0];

        const wRes = await fetch(
          `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`
        );
        const wData = await wRes.json();
        
        // Safety check for current_weather data
        const cw = wData.current_weather;
        if (!cw) throw new Error('No weather data');

        const wmo = WMO_CODES[cw.weathercode] || { label: 'Unknown', emoji: '🌡️' };

        setWeather({
          temp: Math.round(cw.temperature),
          condition: wmo.label,
          emoji: wmo.emoji,
          windspeed: cw.windspeed,
          city,
        });
      } catch (e) {
        console.error("Weather error:", e);
        setError('Weather unavailable');
        setWeather({ temp: 20, condition: 'Offline', emoji: '☁️', manual: true });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, error };
}

export function getTempCategory(tempC) {
  if (tempC === null || tempC === undefined) return 'warm'; // Default fallback
  if (tempC <= 5) return 'cold';
  if (tempC <= 15) return 'cool';
  if (tempC <= 25) return 'warm';
  return 'hot';
}