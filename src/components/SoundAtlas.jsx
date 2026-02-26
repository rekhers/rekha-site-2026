"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const REGIONS = [
  {
    id: "na",
    name: "North America",
    lat: 40.7,
    lon: -74.0,
    ipa: "/ˈnɔːrθ əˈmɛrɪkə/",
    frequency: 220,
  },
  {
    id: "sa",
    name: "South America",
    lat: -12.0,
    lon: -77.0,
    ipa: "/ˈsaʊθ əˈmɛrɪkə/",
    frequency: 247,
  },
  {
    id: "eu",
    name: "Europe",
    lat: 48.8,
    lon: 2.3,
    ipa: "/ˈjʊərəp/",
    frequency: 262,
  },
  {
    id: "af",
    name: "Africa",
    lat: -1.3,
    lon: 36.8,
    ipa: "/ˈæfrɪkə/",
    frequency: 294,
  },
  {
    id: "as",
    name: "Asia",
    lat: 35.7,
    lon: 139.7,
    ipa: "/ˈeɪʒə/",
    frequency: 330,
  },
  {
    id: "oc",
    name: "Oceania",
    lat: -33.9,
    lon: 151.2,
    ipa: "/ˌoʊsiˈæniə/",
    frequency: 370,
  },
];

const getNearestRegion = (lat, lon) => {
  if (lat == null || lon == null) return REGIONS[0];
  let closest = REGIONS[0];
  let best = Infinity;
  REGIONS.forEach((region) => {
    const dx = region.lat - lat;
    const dy = region.lon - lon;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < best) {
      best = dist;
      closest = region;
    }
  });
  return closest;
};

export default function SoundAtlas() {
  const [active, setActive] = useState(REGIONS[0]);
  const [status, setStatus] = useState("Detecting location…");
  const [hover, setHover] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Location unavailable.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const region = getNearestRegion(
          position.coords.latitude,
          position.coords.longitude
        );
        setActive(region);
        setStatus(`Personalized to ${region.name}`);
      },
      () => {
        setStatus("Location blocked.");
      }
    );
  }, []);

  const playTone = (region) => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const audioContext = audioRef.current;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = region.frequency;
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.6
    );
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.65);
  };

  const activeRegion = hover || active;
  const coords = useMemo(() => {
    return `${activeRegion.lat.toFixed(2)}°, ${activeRegion.lon.toFixed(2)}°`;
  }, [activeRegion]);

  return (
    <div className="sound-atlas-shell">
      <div className="sound-atlas-map">
        <div className="sound-atlas-grid" />
        <div className="sound-atlas-marker" />
        <div className="sound-atlas-beam" />
        <div className="sound-atlas-legend">
          <div className="sound-atlas-title">{activeRegion.name}</div>
          <div className="sound-atlas-ipa">{activeRegion.ipa}</div>
          <div className="sound-atlas-coords">{coords}</div>
        </div>
      </div>

      <div className="sound-atlas-panel">
        <div className="sound-atlas-status">{status}</div>
        <div className="sound-atlas-list">
          {REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onMouseEnter={() => setHover(region)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                setActive(region);
                playTone(region);
              }}
              className={`sound-atlas-item ${
                active.id === region.id ? "is-active" : ""
              }`}
            >
              <span>{region.name}</span>
              <span className="sound-atlas-ipa-inline">{region.ipa}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
