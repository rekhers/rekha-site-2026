"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import styles from "./lamproom.module.css";
const Scene = dynamic(() => import("./scene"), { ssr: false });
export default function Lamproom() {
  const [skylight, setSkylight] = useState(0);
  const [season, setSeason] = useState(1);
  const [walking, setWalking] = useState(false);
  const [sun, setSun] = useState(0.35);
  const [warmth, setWarmth] = useState(0.7);
  const [brightness, setBrightness] = useState(0.65);
  return (
    <main className={styles.room}>
      <Scene skylight={skylight} season={season} onStartedWalking={() => setWalking(true)} sun={sun} warmth={warmth} brightness={brightness} />
      <header className={styles.header} data-walking={walking}>
        <Link href="/">← Rekha Tenjarla</Link>
        <h1>Lamproom</h1>
        <p>An experiment in lighting</p>
      </header>
      <aside className={styles.controls} aria-label="Room lighting">
        <label>Warmth<input aria-label="Light warmth" type="range" min="0" max="1" step="0.01" value={warmth} onChange={(e) => setWarmth(Number(e.target.value))} /></label>
        <label>Glow<input aria-label="Light brightness" type="range" min="0.1" max="1" step="0.01" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></label>
        <label>Sun position<input aria-label="Sun position" type="range" min="0" max="1" step="0.01" value={sun} onChange={(e) => setSun(Number(e.target.value))} /></label>
        <label>Open skylight<input aria-label="Open skylight" type="range" min="0" max="1" step="0.01" value={skylight} onChange={e=>setSkylight(Number(e.target.value))}/></label>
        <label>Season<select aria-label="Season" value={season} onChange={e=>setSeason(Number(e.target.value))}><option value="0">Spring</option><option value="1">Summer</option><option value="2">Autumn</option><option value="3">Winter</option></select></label>
        <p>Arrow keys / WASD to walk · drag to look<br />Touch: hold to walk, slide to steer · sunroom up the wooden stairs on your right</p>
      </aside>
    </main>
  );
}
