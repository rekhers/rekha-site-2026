"use client";
import { useEffect, useRef } from "react";
import styles from "./museum.module.css";

export default function Thumbstick({ movementRef }) {
  const control = useRef(null);
  const pointer = useRef(null);

  useEffect(() => {
    const reset = () => {
      movementRef.current = { x: 0, y: 0 };
      pointer.current = null;
      control.current?.style.setProperty("--stick-x", "0px");
      control.current?.style.setProperty("--stick-y", "0px");
    };
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      reset();
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [movementRef]);

  const update = (event) => {
    if (event.pointerId !== pointer.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) / 38;
    const y = (event.clientY - bounds.top - bounds.height / 2) / 38;
    const length = Math.hypot(x, y);
    const scale = Math.max(1, length);
    // Small dead zone; reach full speed before the thumb hits the outer rim.
    const strength = Math.min(1, Math.max(0, (length - 0.06) / 0.66));
    movementRef.current =
      length > 0
        ? { x: (x / length) * strength, y: (-y / length) * strength }
        : { x: 0, y: 0 };
    event.currentTarget.style.setProperty("--stick-x", `${(x / scale) * 38}px`);
    event.currentTarget.style.setProperty("--stick-y", `${(y / scale) * 38}px`);
  };
  const stop = (event) => {
    if (event.pointerId !== pointer.current) return;
    pointer.current = null;
    movementRef.current = { x: 0, y: 0 };
    event.currentTarget.style.setProperty("--stick-x", "0px");
    event.currentTarget.style.setProperty("--stick-y", "0px");
  };
  return (
    <div className={styles.touchMovement}>
      <div
        ref={control}
        className={styles.thumbstick}
        role="group"
        aria-label="Drag to walk forward, backward, or sideways"
        onPointerDown={(event) => {
          if (pointer.current !== null) return;
          event.preventDefault();
          pointer.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          update(event);
        }}
        onPointerMove={update}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      >
        <span aria-hidden="true">↑</span>
        <i />
      </div>
      <small>Move · drag scene to look</small>
    </div>
  );
}
