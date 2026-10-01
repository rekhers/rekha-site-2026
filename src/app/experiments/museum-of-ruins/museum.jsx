"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { exhibits, rooms, classroomDesk } from "./exhibits";
import styles from "./museum.module.css";
import Thumbstick from "./thumbstick";
const Room = dynamic(() => import("./room"), { ssr: false });
export default function Museum() {
  const [roomIndex, setRoomIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const [exhibit, setExhibit] = useState(null);
  const [paused, setPaused] = useState(false);
  const dialog = useRef(null);
  const movementRef = useRef({ x: 0, y: 0 });
  const modalOpen = paused || Boolean(exhibit);

  useEffect(() => {
    const element = dialog.current;
    if (modalOpen && !element.open) element.showModal();
    if (!modalOpen && element.open) element.close();
  }, [modalOpen]);

  const closePanel = () => {
    if (exhibit) setExhibit(null);
    else setPaused(false);
  };

  return (
    <main className={styles.museum}>
      <Room
        movementRef={movementRef}
        entered={entered}
        onRoomChange={setRoomIndex}
        active={entered && !modalOpen}
        onSelect={(item) => {
          if (entered && !modalOpen) setExhibit(item);
        }}
      />
      <header className={styles.header}>
        <a href="/experiments">← Experiments</a>
        <span>
          MUSEUM OF RUINS <small>Five rooms · An exhibition in progress</small>
        </span>
      </header>
      {!entered && (
        <section className={styles.entry}>
          <p>A walk through what remains</p>
          <h1>
            Museum
            <br />
            of Ruins
          </h1>
          <p>
            The unraveling of public institutions and our collective civic life.
          </p>
          <button onClick={() => setEntered(true)}>Enter the museum →</button>
          <small>
            <span className={styles.keyboardHint}>
              ↑ ↓ walk · ← → turn · drag to look
            </span>
            <span className={styles.touchHint}>
              Thumbstick to walk · drag the scene to look
            </span>
            <br />
            Approach an exhibit and click its placard.
          </small>
        </section>
      )}
      {entered && (
        <footer className={styles.controls}>
          <span>
            {rooms[roomIndex].number} / 05 · {rooms[roomIndex].title}
            <br />↑ ↓ walk &nbsp; ← → turn &nbsp; · &nbsp; Drag to look
          </span>
          <button onClick={() => setPaused(true)}>Pause</button>
        </footer>
      )}
      {entered && !modalOpen && <Thumbstick movementRef={movementRef} />}
      <dialog
        ref={dialog}
        className={styles.label}
        aria-labelledby="museum-panel-title"
        onCancel={(event) => {
          event.preventDefault();
          closePanel();
        }}
      >
        <button
          className={styles.close}
          aria-label={exhibit ? "Close placard" : "Resume exploring"}
          onClick={closePanel}
        >
          ×
        </button>
        {exhibit ? (
          <>
            <small>STUDY OBJECT / {exhibit.number}</small>
            <h2 id="museum-panel-title">{exhibit.title}</h2>
            <p>{exhibit.text}</p>
            {exhibit.credit && (
              <p className={styles.note}>
                “
                <a
                  href="https://sketchfab.com/3d-models/school-desk-and-chair-004b95391e4e48a797ee8d0cf612b5cf"
                  target="_blank"
                  rel="noreferrer"
                >
                  School Desk and Chair
                </a>
                ” by{" "}
                <a
                  href="https://sketchfab.com/Tian96"
                  target="_blank"
                  rel="noreferrer"
                >
                  T I A N
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 4.0
                </a>
                . Scaled and positioned for this installation.
              </p>
            )}
            <p className={styles.note}>
              Placeholder installation. Archival material and factual exhibit
              text to follow.
            </p>
            <button onClick={closePanel}>
              {paused ? "Back to contents" : "Return to the gallery"}
            </button>
          </>
        ) : (
          <>
            <small>EXPLORATION PAUSED</small>
            <h2 id="museum-panel-title">The collection</h2>
            <p>Browse the placards, or return to where you left off.</p>
            <ol className={styles.contents}>
              {rooms.map((room) => (
                <li key={room.id}>
                  <h3>
                    <small>{room.number}</small> {room.title}
                  </h3>
                  <p>{room.description}</p>
                  {[...exhibits, classroomDesk]
                    .filter((item) => item.roomId === room.id)
                    .map((item) => (
                      <button
                        key={item.number}
                        onClick={() => setExhibit(item)}
                      >
                        <span>{item.number}</span>
                        {item.title}
                        <span aria-hidden="true">↗</span>
                      </button>
                    ))}
                </li>
              ))}
            </ol>
            <button onClick={() => setPaused(false)}>Resume exploring →</button>
          </>
        )}
      </dialog>
    </main>
  );
}
