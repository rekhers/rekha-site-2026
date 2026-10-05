"use client";
import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

function seededRandom() {
  let seed = 73;
  return () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
}

export default function Skyline() {
  const { sky, facade, buildings } = useMemo(() => {
    const random = seededRandom();
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#aecbdc");
    gradient.addColorStop(.6, "#e0e7e5");
    gradient.addColorStop(1, "#eee9de");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 512);
    const sky = new CanvasTexture(canvas); sky.colorSpace = SRGBColorSpace;
    const wall = document.createElement("canvas"); wall.width = 256; wall.height = 512;
    const paint = wall.getContext("2d");
    paint.fillStyle = "#d0d0ca"; paint.fillRect(0, 0, 256, 512);
    for (let y = 12; y < 512; y += 25) for (let x = 10; x < 256; x += 24) {
      const shade = 135 + Math.floor(random() * 40);
      paint.fillStyle = `rgb(${shade},${shade + 8},${shade + 11})`;
      paint.fillRect(x, y, 12, 15);
      paint.fillStyle = "#b8bbb7"; paint.fillRect(x, y + 15, 14, 2);
    }
    const facade = new CanvasTexture(wall); facade.colorSpace = SRGBColorSpace; facade.anisotropy = 4;
    const buildings = Array.from({ length: 42 }, (_, i) => {
      const far = i < 23;
      return { x: far ? 115 + random() * 15 : 65 + random() * 18, z: (i % 23 - 11) * (far ? 11 : 10), width: 5 + random() * 6, height: 12 + random() * 24, depth: 5 + random() * 7, far, roof: random() > .5 };
    });
    return { sky, facade, buildings };
  }, []);
  useEffect(() => () => { sky.dispose(); facade.dispose(); }, [sky, facade]);
  return (
    <group>
      {/* The room is above street level; distant geometry gives the view parallax. */}
      <mesh position={[160, 35, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[650, 250]} /><meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, -23 + b.height / 2, b.z]}>
          <mesh><boxGeometry args={[b.depth, b.height, b.width]} /><meshBasicMaterial color={b.far ? "#c3cdd1" : "#a6b1b4"} toneMapped={false} /></mesh>
          {!b.far && <mesh position={[-b.depth / 2 - .01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[b.width, b.height]} /><meshBasicMaterial map={facade} color="#d0d8d9" toneMapped={false} /></mesh>}
          {b.roof && <mesh position={[0, b.height / 2 + .55, 0]}><boxGeometry args={[b.depth * .45, 1.1, b.width * .5]} /><meshBasicMaterial color={b.far ? "#c3cdd1" : "#b4bec0"} toneMapped={false} /></mesh>}
        </group>
      ))}
    </group>
  );
}
