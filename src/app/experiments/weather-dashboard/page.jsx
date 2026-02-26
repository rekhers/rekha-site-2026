"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import WeatherGlobeScene from "../../../components/WeatherGlobeScene";

const DEFAULT_LOCATION = {
  name: "New York City",
  latitude: 40.7128,
  longitude: -74.006,
};

const WEATHER_CODES = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm + hail",
  99: "Hail",
};

const WEATHER_ICONS = {
  clear: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M11 37l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M16 34h16a8 8 0 0 0 0-16 10 10 0 0 0-19.4 2.8A6 6 0 0 0 16 34Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  rain: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M14 26h18a7 7 0 0 0 0-14 9 9 0 0 0-17.2 2.5A6 6 0 0 0 14 26Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M18 32l-2 6M26 32l-2 6M34 32l-2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M14 26h18a7 7 0 0 0 0-14 9 9 0 0 0-17.2 2.5A6 6 0 0 0 14 26Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M18 34h0M26 34h0M34 34h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  fog: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M12 22h24M8 28h32M12 34h24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  storm: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M14 24h18a7 7 0 0 0 0-14 9 9 0 0 0-17.2 2.5A6 6 0 0 0 14 24Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24 26l-4 8h6l-4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const buildSparkline = (values, width, height) => {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};

export default function WeatherDashboardPage() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [status, setStatus] = useState("Detecting location…");
  const [forecast, setForecast] = useState(null);
  const [units] = useState("imperial");
  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION.name);
  const [mode, setMode] = useState("overview");
  const [command, setCommand] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Location unavailable, showing default city.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          name: "Your location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setStatus("Location blocked, showing default city.");
      },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setStatus("Fetching forecast…");
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", location.latitude.toFixed(4));
        url.searchParams.set("longitude", location.longitude.toFixed(4));
        url.searchParams.set(
          "hourly",
          "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,surface_pressure,dew_point_2m,uv_index"
        );
        url.searchParams.set("current_weather", "true");
        url.searchParams.set("timezone", "auto");
        url.searchParams.set("temperature_unit", "fahrenheit");
        url.searchParams.set("windspeed_unit", "mph");
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Forecast failed");
        const data = await response.json();
        setForecast(data);
        setStatus("Live");
      } catch (error) {
        console.error(error);
        setStatus("Unable to load forecast.");
      }
    };
    fetchForecast();
  }, [location, units]);

  useEffect(() => {
    const resolveName = async () => {
      try {
        const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
        url.searchParams.set("latitude", location.latitude.toFixed(4));
        url.searchParams.set("longitude", location.longitude.toFixed(4));
        url.searchParams.set("count", "1");
        const response = await fetch(url.toString());
        if (!response.ok) return;
        const data = await response.json();
        const first = data?.results?.[0];
        if (first) {
          const label = [first.name, first.admin1, first.country]
            .filter(Boolean)
            .join(", ");
          setLocationLabel(label || location.name);
          return;
        }
      } catch (error) {
        // keep the last resolved label if reverse geocode fails
      }
    };
    resolveName();
  }, [location]);

  const sparkline = useMemo(() => {
    if (!forecast?.hourly?.temperature_2m) return "";
    return buildSparkline(forecast.hourly.temperature_2m.slice(0, 24), 360, 120);
  }, [forecast]);

  const temps = useMemo(() => {
    return forecast?.hourly?.temperature_2m?.slice(0, 24) ?? [];
  }, [forecast]);

  const timeLabels = useMemo(() => {
    return forecast?.hourly?.time?.slice(0, 24) ?? [];
  }, [forecast]);

  const current = forecast?.current_weather;
  const hourly = forecast?.hourly;
  const variant = useMemo(() => {
    const code = current?.weathercode ?? 0;
    if (code === 0) return "clear";
    if (code >= 1 && code <= 3) return "cloud";
    if (code >= 45 && code <= 48) return "fog";
    if (code >= 51 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 80 && code <= 86) return "showers";
    if (code >= 95) return "storm";
    return "cloud";
  }, [current]);

  const accent = useMemo(() => {
    switch (variant) {
      case "clear":
        return "#4a274f";
      case "cloud":
        return "#4b5563";
      case "fog":
        return "#64748b";
      case "rain":
        return "#2563eb";
      case "snow":
        return "#38bdf8";
      case "showers":
        return "#3b82f6";
      case "storm":
        return "#0f172a";
      default:
        return "#4a274f";
    }
  }, [variant]);

  const icon = WEATHER_ICONS[variant] || WEATHER_ICONS.cloud;

  const tempUnit = "°F";
  const windUnit = "mph";

  return (
    <div className="weather-skin flex min-h-screen w-full flex-col gap-8 px-6 py-16 text-white sm:px-12 lg:px-16">
      <nav className="geist-mono text-[11px] uppercase tracking-[0.35em] text-zinc-500">
        <Link href="/" className="hover:text-zinc-700">
          Home
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <Link href="/experiments" className="hover:text-zinc-700">
          Experiments
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-zinc-600">Weather Dashboard</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Weather Dashboard
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-300">
          A realtime, location-aware forecast with atmospheric cues and a
          minimal read on the next 24 hours.
        </p>
      </header>

      <div className="weather-controls">
        <div className="weather-modes">
          {["overview", "wind", "pressure"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`weather-mode ${mode === item ? "is-active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <form
          className="weather-command"
          onSubmit={(event) => {
            event.preventDefault();
            const match = command.match(/mode:\\s*(\\w+)/i);
            if (match) {
              setMode(match[1].toLowerCase());
            }
            setCommand("");
          }}
        >
          <span className="weather-command-label">CMD:</span>
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="mode: wind"
          />
        </form>
      </div>

      <div className={`weather-stage weather-${variant}`}>
        <div className="weather-orb" aria-hidden="true" />
        <div className="weather-noise" aria-hidden="true" />
        <div className="weather-grid">
          <div className="weather-hero">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-200">
              {locationLabel}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
              {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
            </p>
            <div className="mt-6 flex items-end gap-4">
              <span className="text-6xl font-semibold text-white">
                {current?.temperature ?? "--"}
                <span className="text-2xl">{tempUnit}</span>
              </span>
              <div className="pb-2 text-sm text-zinc-300">
                <div>{WEATHER_CODES[current?.weathercode] || "—"}</div>
                <div className="uppercase tracking-[0.2em]">{status}</div>
              </div>
              <div className="weather-icon">{icon}</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 text-sm text-zinc-300">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Wind</div>
                <div>
                  {current?.windspeed ?? "--"} {windUnit}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  Humidity
                </div>
                <div>{hourly?.relative_humidity_2m?.[0] ?? "--"}%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  Pressure
                </div>
                <div>
                  {hourly?.surface_pressure?.[0]
                    ? `${hourly.surface_pressure[0]} hPa`
                    : "--"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  Wind Dir
                </div>
                <div>{current?.winddirection ?? "--"}°</div>
              </div>
            </div>
          </div>

          <div className="weather-panel weather-panel-globe">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Atmospheric field
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
              Wind vectors · global grid · emissive shell
            </p>
            <p className="mt-3 text-xs leading-5 text-zinc-400">
              Vectors encode wind bearing and magnitude (normalized to 0–30 mph).
              Grid lines mark 30° lat/long. The emissive shell is the glowing
              outer layer that brightens with current conditions.
            </p>
            <div className="mt-6">
              <WeatherGlobeScene
                windSpeed={current?.windspeed ?? 0}
                windDirection={current?.winddirection ?? 0}
                accent={accent}
              />
            </div>
          </div>

          <div className="weather-panel">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Next 24 hours
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Temp
              </p>
            </div>
            <div className="mt-4 weather-hud">
              <span>
                Local {timeLabels[0] ? new Date(timeLabels[0]).toLocaleString() : "--"}
              </span>
              <span>UTC {forecast?.utc_offset_seconds ?? "--"}</span>
              <span>LAT {location.latitude.toFixed(2)}</span>
              <span>LON {location.longitude.toFixed(2)}</span>
              <span>MODE {status.toUpperCase()}</span>
            </div>
            <div className="mt-4 h-[160px] w-full weather-line-wrapper">
              <svg viewBox="0 0 360 160" className="h-full w-full">
                <path d={sparkline} className="weather-line" />
                {temps.map((temp, index) => {
                  if (index % 4 !== 0) return null;
                  const x = (index / 23) * 360;
                  const min = Math.min(...temps);
                  const max = Math.max(...temps);
                  const range = max - min || 1;
                  const y = 120 - ((temp - min) / range) * 120 + 10;
                  return (
                    <text
                      key={`temp-${index}`}
                      x={x}
                      y={y}
                      fill="#e2e8f0"
                      fontSize="10"
                      textAnchor="middle"
                      opacity="0.8"
                    >
                      {Math.round(temp)}
                    </text>
                  );
                })}
              </svg>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
              <span>Now</span>
              <span>+24h</span>
            </div>
          </div>

          <div className="weather-panel">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Data window
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                10 m
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-6 text-sm text-zinc-300">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  Wind Vector
                </div>
                <div>
                  {current?.windspeed ?? "--"} {windUnit} @{" "}
                  {current?.winddirection ?? "--"}°
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  Air Density
                </div>
                <div>
                  {hourly?.surface_pressure?.[0] && hourly?.temperature_2m?.[0]
                    ? `${Math.round(
                        (hourly.surface_pressure[0] * 100) /
                          (287.05 * (hourly.temperature_2m[0] + 273.15)) *
                          1000
                      ) / 1000} kg/m³`
                    : "--"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  Dew Point
                </div>
                <div>
                  {hourly?.dew_point_2m?.[0] !== undefined
                    ? `${Math.round(hourly.dew_point_2m[0])}${tempUnit}`
                    : "--"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">
                  UV Index
                </div>
                <div>
                  {hourly?.uv_index?.[0] !== undefined
                    ? hourly.uv_index[0].toFixed(1)
                    : "--"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="weather-footer">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Data:{" "}
            <a
              href="https://open-meteo.com/en/docs"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Open-Meteo (CC BY 4.0)
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
