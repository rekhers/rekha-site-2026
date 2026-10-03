"use client";
import { useEffect, useRef } from "react";
import { rooms, entrance, exitHall, roomWalls, canWalk, deskCluster, roeMonument } from "./exhibits";
import styles from "./museum.module.css";

export default function Blueprint({ poseRef, travelRef }) {
  const svg = useRef(null);
  const dot = useRef(null);
  const pointer = useRef(null);
  useEffect(() => {
    let frame;
    const update = () => {
      const { x, z, yaw } = poseRef.current;
      dot.current?.setAttribute("transform", `translate(${x} ${z}) rotate(${-yaw * 180 / Math.PI})`);
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [poseRef]);
  const move = (event) => {
    if (pointer.current !== event.pointerId) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.current.getScreenCTM().inverse());
    // Invalid destinations leave the visitor at the last valid point.
    if (canWalk(point.x, point.y) && point.y < entrance.front - 0.7) {
      travelRef.current = { x: point.x, z: point.y };
    }
  };
  const stop = () => { pointer.current = null; };
  return (
    <aside className={styles.blueprint} aria-label="Museum floor plan">
      <div><strong>THE COLLECTION</strong><span>Drag your dot to move</span></div>
      <svg ref={svg} viewBox="-15 -27 59 40" aria-label="Floor plan showing all five rooms and your current position">
        {[entrance, ...rooms, exitHall].map((room, index) => (
          <g key={index}>
            <rect x={room.x - room.width / 2} y={room.back} width={room.width} height={room.front - room.back} fill="currentColor" opacity="0.045" />
            {roomWalls(room).filter(([p, size]) => p[1] - size[1] / 2 < 0.01).map(([p, size], i) => (
              <rect key={i} x={room.x + p[0] - size[0] / 2} y={p[2] - size[2] / 2} width={size[0]} height={size[2]} fill="currentColor" />
            ))}
            {room.number && <text x={room.x} y={(room.front + room.back) / 2 - 2} textAnchor="middle" fill="currentColor" fontSize="1.5"><title>{room.title}</title>{room.number}</text>}
          </g>
        ))}
        {deskCluster.map(({position}, i) => <circle key={i} cx={position[0]} cy={position[2]} r="0.6" fill="currentColor" opacity=".25" />)}
        <rect x={roeMonument.position[0] - .75} y={roeMonument.position[2] - 1.2} width="1.5" height="2.4" fill="currentColor" opacity=".25" />
        <g ref={dot} onPointerDown={(event) => { event.preventDefault(); pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop} style={{cursor: "grab", touchAction: "none"}}>
          <circle r="1.8" fill="transparent" />
          <path d="M-.65 -.7 L0 -1.65 L.65 -.7" fill="#a84932" />
          <circle r=".65" fill="#a84932" stroke="#f4f0e7" strokeWidth=".22" />
        </g>
      </svg>
      <small>01 Humanities · 02 Presidency · 03 Queer Archive<br />04 ICE · 05 Personal Collection</small>
    </aside>
  );
}
