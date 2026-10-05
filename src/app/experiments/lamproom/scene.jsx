"use client";
import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Color, RepeatWrapping, SRGBColorSpace } from "three";
import Furniture from "./furniture";
import Loft from "./loft";
import Walk from "./walk";
import Stairs from "./stairs";
import ArchitectureDetails from "./architecture";

function Floor({ pale = false }) {
  const originals = useTexture([
    "/materials/parquet/WoodFloor043_1K-JPG_Color.jpg",
    "/materials/parquet/WoodFloor043_1K-JPG_NormalGL.jpg",
    "/materials/parquet/WoodFloor043_1K-JPG_Roughness.jpg",
  ]);
  const maps = useMemo(() => originals.map((source, index) => {
    const texture = source.clone();
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.anisotropy = 8;
    if (index === 0) texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }), [originals]);
  useEffect(() => () => maps.forEach((texture) => texture.dispose()), [maps]);
  return (
    <mesh position={[pale ? 14 : 0, pale ? 4 : 0, pale ? -10 : 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color={pale ? "#fff3df" : "#ffffff"} emissive={pale ? "#827460" : "#000000"} emissiveIntensity={pale ? 0.12 : 0} map={maps[0]} normalMap={maps[1]} roughnessMap={maps[2]} roughness={0.62} normalScale={[0.35, 0.35]} />
    </mesh>
  );
}

function Interior({ warmth, brightness, sun, season, skylight, onStartedWalking }) {
  const color = useMemo(() => new Color("#e2ecff").lerp(new Color("#ffb764"), warmth), [warmth]);
  return (
    <>
      <color attach="background" args={["#c9dce7"]} />
      <ambientLight intensity={0.12} />
      <hemisphereLight args={["#e8dfd0", "#493021", 0.25]} />
      <Suspense fallback={<mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#755035" /></mesh>}><Floor /></Suspense>
      {[
        [[0, 2.3, -7], [14, 4.6, 0.16]],
        [[-7, 2.3, 0], [0.16, 4.6, 14]],
        [[6.96, 2.3, -3.25], [0.08, 4.6, 7.5]],
        [[6.96, 2.3, 5.75], [0.08, 4.6, 2.5]],
        [[6.96, 4.1, 2.5], [0.08, 1, 4]],
        [[0, 2.3, 7], [14, 4.6, 0.16]],
        [[0, 4.6, 0], [14, 0.16, 14]],
      ].map(([position, size], i) => (
        <mesh key={i} position={position} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={i === 6 ? "#c7bca9" : "#b9ab95"} roughness={0.95} />
        </mesh>
      ))}
      {[
        [[0, 0.1, -6.88], [13.8, 0.2, 0.08]],
        [[0, 0.1, 6.88], [13.8, 0.2, 0.08]],
        [[-6.88, 0.1, 0], [0.08, 0.2, 13.8]],
        [[6.88, 0.1, -3.25], [0.08, 0.2, 7.3]],
        [[6.88, 0.1, 5.75], [0.08, 0.2, 2.3]],
      ].map(([position, size], i) => (
        <mesh key={i} position={position}><boxGeometry args={size} /><meshStandardMaterial color="#7c6b54" roughness={0.8} /></mesh>
      ))}
      <Suspense fallback={null}><Furniture color={color} brightness={brightness} /></Suspense>
      <rectAreaLight position={[0, 3.5, 2]} rotation={[-0.65, 0, 0]} width={4} height={2} color={color} intensity={2 * brightness} />
      <Suspense fallback={null}><Floor pale /></Suspense>
      <Stairs />
      <ArchitectureDetails />
      <group position={[0,4,-10]}><Loft sun={sun} season={season} skylight={skylight} /></group>
      <Walk onStartedWalking={onStartedWalking} />
    </>
  );
}
export default function Scene(props) {
  return <Canvas shadows camera={{position: [0, 1.8, 5.2], fov: 60}} dpr={[1, 1.5]} gl={{antialias: true}}><Interior {...props} /></Canvas>;
}
