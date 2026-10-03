"use client";
import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { surfaceTexture } from "./materials";
import { roeMonument } from "./exhibits";

export default function Monument() {
  const stone = useMemo(() => surfaceTexture(5), []);
  const inscription = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 2348;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#c9c1b0";
    ctx.fillRect(0, 0, 1024, 2348);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const [text, y, size] of [["ROE v. WADE", 1000, 91], ["1973–2022", 1200, 65]]) {
      ctx.font = `${size}px Baskerville, Georgia, serif`;
      ctx.fillStyle = "#eee7d7";
      ctx.fillText(text, 513, y + 2);
      ctx.fillStyle = "#635d52";
      ctx.fillText(text, 512, y);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => { stone.dispose(); inscription.dispose(); }, [stone, inscription]);
  return (
    <group position={roeMonument.position} rotation={[0, -Math.PI / 2, 0]}>
      {/* Backing, jambs and lintel surround a sealed, recessed doorway. */}
      {[
        [[0, 0.12, 0], [2.4, 0.24, 1.5]],
        [[0, 0.31, 0], [2.05, 0.14, 1.15]],
        [[0, 1.94, -0.23], [1.8, 3.12, 0.44]],
        [[-0.74, 1.83, 0.19], [0.32, 2.9, 0.4]],
        [[0.74, 1.83, 0.19], [0.32, 2.9, 0.4]],
        [[0, 3.34, 0.19], [1.8, 0.32, 0.4]],
        [[0, 0.46, 0.19], [1.8, 0.16, 0.4]],
      ].map(([position, size], i) => (
        <mesh key={i} position={position} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#d8d0bf" roughness={0.88} bumpMap={stone} bumpScale={0.018} />
        </mesh>
      ))}
      <mesh position={[0, 1.87, 0.001]} receiveShadow>
        <planeGeometry args={[1.16, 2.66]} />
        <meshStandardMaterial map={inscription} roughness={0.95} bumpMap={stone} bumpScale={0.008} />
      </mesh>
      <rectAreaLight position={[-1.5, 4.4, 2.7]} rotation={[-0.55, -0.35, 0]} width={2} height={1.2} intensity={5} color="#fff5e2" />
    </group>
  );
}
