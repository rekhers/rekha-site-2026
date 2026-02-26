"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Color, Vector3 } from "three";

const buildLatitude = (lat) => {
  const points = [];
  const steps = 64;
  const radius = Math.cos(lat);
  const y = Math.sin(lat);
  for (let i = 0; i <= steps; i += 1) {
    const theta = (i / steps) * Math.PI * 2;
    points.push(new Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
  }
  return points;
};

const buildLongitude = (lng) => {
  const points = [];
  const steps = 64;
  for (let i = 0; i <= steps; i += 1) {
    const phi = (i / steps) * Math.PI;
    const x = Math.sin(phi) * Math.cos(lng);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(lng);
    points.push(new Vector3(x, y, z));
  }
  return points;
};

function Globe({ windSpeed = 0, windDirection = 0, accent = "#00f5ff" }) {
  const globeRef = useRef(null);
  const windRef = useRef(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0015;
    }
    if (windRef.current) {
      windRef.current.rotation.y += 0.002;
    }
  });

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -2; i <= 2; i += 1) {
      lines.push(buildLatitude((i / 6) * Math.PI));
    }
    for (let i = 0; i < 6; i += 1) {
      lines.push(buildLongitude((i / 6) * Math.PI * 2));
    }
    return lines;
  }, []);

  const windLines = useMemo(() => {
    const lines = [];
    const count = 14;
    const strength = Math.min(Math.max(windSpeed / 30, 0.25), 1.2);
    const direction = (windDirection * Math.PI) / 180;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const base = new Vector3(Math.cos(angle), 0.2 * Math.sin(angle * 2), Math.sin(angle));
      const tangent = new Vector3(Math.cos(angle + direction), 0, Math.sin(angle + direction))
        .multiplyScalar(0.35 * strength);
      const points = [base.clone().multiplyScalar(1.05), base.clone().multiplyScalar(1.05).add(tangent)];
      lines.push(points);
    }
    return lines;
  }, [windSpeed, windDirection]);

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#0b0f1f"
          metalness={0.3}
          roughness={0.4}
          emissive={new Color(accent)}
          emissiveIntensity={0.18}
        />
      </mesh>
      {gridLines.map((line, index) => (
        <Line key={`grid-${index}`} points={line} color="#2b2c39" lineWidth={1} />
      ))}
      <mesh>
        <sphereGeometry args={[1.03, 48, 48]} />
        <meshBasicMaterial
          color={new Color(accent)}
          transparent
          opacity={0.22}
          wireframe
        />
      </mesh>
      <group ref={windRef}>
        {windLines.map((line, index) => (
          <Line
            key={`wind-${index}`}
            points={line}
            color={accent}
            lineWidth={1.5}
            transparent
            opacity={0.6}
          />
        ))}
      </group>
    </group>
  );
}

export default function WeatherGlobeScene({ windSpeed, windDirection, accent }) {
  return (
    <div className="weather-globe">
      <Canvas camera={{ position: [0, 0.4, 3.2], fov: 40 }}>
        <color attach="background" args={["#05060d"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />
        <pointLight position={[-2, 0.5, 2]} intensity={0.8} color="#00f5ff" />
        <Globe windSpeed={windSpeed} windDirection={windDirection} accent={accent} />
      </Canvas>
    </div>
  );
}
