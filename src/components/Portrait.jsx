"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import styles from "../app/home.module.css";

export default function Portrait() {
  const maskId = useId();
  const [drawingReady, setDrawingReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const artwork = new window.Image();
    artwork.onload = () => setDrawingReady(true);
    artwork.src = "/rekha-crayon.png";
    return () => { artwork.onload = null; };
  }, []);
  return (
    <figure className={styles.portrait}>
      <button
        type="button"
        className={styles.portraitButton}
        aria-label="Reveal Rekha’s portrait"
        aria-pressed={revealed}
        data-revealed={revealed}
        data-hovered={hovered}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onClick={() => setRevealed(!revealed)}
      >
        <Image className={styles.portraitPhoto} quality={95} src="/bio-pic.jpg" alt="Rekha Tenjarla smiling, seated on a couch" width={3870} height={5796} sizes="(max-width: 600px) 46vw, (max-width: 1199px) 240px, 280px" />
        <svg className={styles.crayon} viewBox="160 560 1500 1150" aria-hidden="true">
          <defs>
            <filter id={`${maskId}-purple`} colorInterpolationFilters="sRGB">
              <feFlood floodColor="#3f46bd" result="purple" />
              <feComposite in="purple" in2="SourceGraphic" operator="in" />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="2048" height="2048">
              {/* Follow the center of the original crayon mark; reveal its pixels, not a replacement stroke. */}
              <path
                className={styles.crayonTrace}
                data-ready={drawingReady}
                d="M 270 1340 C 380 1170 605 900 845 700 C 915 630 900 735 850 820 C 735 1000 610 1190 590 1390 C 580 1480 690 1350 755 1275 C 870 1140 960 1190 935 1340 C 900 1490 990 1515 1100 1495 C 1260 1470 1420 1490 1580 1610"
                pathLength="1"
                fill="none"
                stroke="white"
                strokeWidth="230"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <image href="/rekha-crayon.png" width="2048" height="2048" mask={`url(#${maskId})`} filter={`url(#${maskId}-purple)`} />
        </svg>
      </button>
      <figcaption className={styles.portraitCaption}>
        <span>Rekha means line</span>
      </figcaption>
    </figure>
  );
}
