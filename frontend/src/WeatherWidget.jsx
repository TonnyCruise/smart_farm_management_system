import { useEffect, useState } from 'react';
import { CloudRain, Sun, Cloud, Wind, Droplets } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Using a central farming coordinate for this demo (e.g. coordinates in Europe/US)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,cloud_cover&timezone=auto')
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !weather) return null; // Gracefully fail if can't load

  const current = weather.current;
  const isRaining = current.precipitation > 0;
  const isCloudy = current.cloud_cover > 50;
  
  return (
    <div className="stat-card" style={{ 
      background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)", 
      color: "white",
      boxShadow: "0 10px 15px -3px rgba(14, 165, 233, 0.3)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="stat-label" style={{ color: "rgba(255,255,255,0.8)" }}>Farm Weather Forecast</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0" }}>
            <span style={{ fontSize: 32, fontWeight: 700 }}>{current.temperature_2m}°C</span>
            <span style={{ fontSize: 13, opacity: 0.8 }}>Feels like {current.apparent_temperature}°</span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, opacity: 0.9, marginTop: 12 }}>
             <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Droplets size={14} /> {current.relative_humidity_2m}%</span>
             <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Wind size={14} /> {current.wind_speed_10m} km/h</span>
          </div>
        </div>
        <div style={{ 
          background: "rgba(255,255,255,0.2)", 
          padding: 12, 
          borderRadius: "50%",
          backdropFilter: "blur(4px)"
        }}>
           {isRaining ? <CloudRain size={32} color="white" /> : isCloudy ? <Cloud size={32} color="white" /> : <Sun size={32} color="white" />}
        </div>
      </div>
    </div>
  );
}
