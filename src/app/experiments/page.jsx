import Link from "next/link";
import shared from "../home.module.css";
import styles from "./experiments.module.css";

const experiments = [
  {
    number: "01",
    title: "Polyphonic Synth",
    href: "/experiments/synth-lab",
    description: "Play a few notes. Shape their attack, filter the sound, and add effects.",
    note: "Make sound",
  },
  {
    number: "02",
    title: "Live Spectrogram",
    href: "/experiments/spectrogram",
    description: "See your voice, a song, or the room around you unfold in three dimensions.",
    note: "Microphone required",
  },
];

export default function ExperimentsIndex() {
  return (
    <div className={shared.page}>
      <main className={shared.main}>
        <nav className={styles.nav} aria-label="Breadcrumb">
          <Link href="/">← Rekha Tenjarla</Link>
        </nav>
        <header className={styles.header}>
          <h1 className={shared.name}>Sound experiments</h1>
          <p className={styles.subtitle}>
            Always playing with sound.
          </p>
        </header>
        <ol className={styles.list}>
          {experiments.map((experiment) => (
            <li key={experiment.href}>
              <Link href={experiment.href} className={styles.experiment}>
                <span className={styles.number} aria-hidden="true">{experiment.number}</span>
                <div>
                  <h2 className={styles.title}>{experiment.title}</h2>
                  <p className={styles.description}>{experiment.description}</p>
                  <span className={styles.note}>{experiment.note}</span>
                </div>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
