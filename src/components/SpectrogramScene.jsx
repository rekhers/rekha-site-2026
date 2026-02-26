"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DataTexture,
  RedFormat,
  UnsignedByteType,
  LinearFilter,
  NearestFilter,
  ClampToEdgeWrapping,
  Vector3,
  Color,
} from "three";

const DEFAULT_BINS = 512;
const DEFAULT_HISTORY = 200;

function SpectrogramMesh({
  analyserRef,
  isActive,
  isFrozen,
  baseColor,
  highlightColor,
}) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const width = DEFAULT_BINS;
  const height = DEFAULT_HISTORY;

  const dataTexture = useMemo(() => {
    const data = new Uint8Array(width * height);
    const texture = new DataTexture(
      data,
      width,
      height,
      RedFormat,
      UnsignedByteType,
    );
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, [width, height]);

  useEffect(() => {
    uniformsRef.current.uData.value = dataTexture;
  }, [dataTexture]);

  const scratchRef = useRef(new Uint8Array(2048));
  const lutRef = useRef({ bins: 0, lut: new Uint16Array(width) });
  const displacement = 1.15;

  const uniformsRef = useRef({
    uData: { value: null },
    uTime: { value: 0 },
    uDisplacement: { value: displacement },
    uLight: { value: new Vector3(0.6, 1.0, 0.4) },
    uColorA: { value: new Color(baseColor) },
    uColorB: { value: new Color(highlightColor) },
  });

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const uniforms = materialRef.current.uniforms;
      uniforms.uTime.value = clock.elapsedTime;
    }

    if (isFrozen) return;
    const analyser = analyserRef.current;
    if (!analyser || !isActive) return;

    if (scratchRef.current.length !== analyser.frequencyBinCount) {
      scratchRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    if (lutRef.current.bins !== analyser.frequencyBinCount) {
      const lut = new Uint16Array(width);
      const maxIndex = analyser.frequencyBinCount - 1;
      const logMax = Math.log10(maxIndex + 1);
      for (let i = 0; i < width; i += 1) {
        const norm = i / (width - 1);
        const logIndex = Math.floor(Math.pow(10, norm * logMax) - 1);
        lut[i] = Math.min(maxIndex, logIndex);
      }
      lutRef.current = { bins: analyser.frequencyBinCount, lut };
    }

    const scratch = scratchRef.current;
    analyser.getByteFrequencyData(scratch);
    const data = dataTexture.image.data;

    data.copyWithin(width, 0, width * (height - 1));
    for (let i = 0; i < width; i += 1) {
      const raw = scratch[lutRef.current.lut[i]] / 255;
      const db = Math.log10(1 + 9 * raw) / Math.log10(10);
      const boosted = Math.pow(db, 1.2);
      data[i] = Math.max(0, Math.min(255, Math.floor(boosted * 255)));
    }

    dataTexture.needsUpdate = true;
  });

  useEffect(() => {
    uniformsRef.current.uColorA.value.set(baseColor);
    uniformsRef.current.uColorB.value.set(highlightColor);
    if (materialRef.current) {
      materialRef.current.uniformsNeedUpdate = true;
    }
  }, [baseColor, highlightColor]);

  return (
    <mesh ref={meshRef} rotation={[-0.3, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[3.6, 2.4, width - 1, height - 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniformsRef.current}
        vertexShader={
          /* glsl */ `
          varying vec2 vUv;
          varying float vIntensity;
          uniform sampler2D uData;
          uniform float uDisplacement;

          void main() {
            vUv = uv;
            vec2 sampleUv = vec2(vUv.y, 1.0 - vUv.x);
            float intensity = texture2D(uData, sampleUv).r;
            intensity = pow(intensity, 1.6);
            vIntensity = intensity;
            vec3 pos = position;
            pos.z += intensity * uDisplacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          varying vec2 vUv;
          varying float vIntensity;
          uniform float uTime;

          uniform vec3 uColorA;
          uniform vec3 uColorB;

          vec3 palette(float t) {
            t = clamp(t, 0.0, 1.0);
            float mid = smoothstep(0.0, 0.6, t);
            float hi = smoothstep(0.6, 1.0, t);
            vec3 c1 = uColorA * 0.4;
            vec3 c2 = uColorA;
            vec3 c3 = mix(uColorA, uColorB, 0.5);
            vec3 c4 = uColorB;
            return mix(mix(c1, c2, mid), mix(c3, c4, hi), hi);
          }

          void main() {
            float intensity = pow(vIntensity, 1.05);
            float edge = smoothstep(0.08, 0.9, intensity);
            vec3 color = palette(intensity);

            float gridX = smoothstep(0.0, 0.02, abs(fract(vUv.x * 16.0) - 0.5));
            float gridY = smoothstep(0.0, 0.02, abs(fract(vUv.y * 12.0) - 0.5));
            float grid = (1.0 - gridX) * 0.12 + (1.0 - gridY) * 0.1;

            color *= 0.5 + edge * 1.8;
            color += grid * vec3(0.15, 0.12, 0.2);

            float peak = smoothstep(0.75, 1.0, intensity);
            color += peak * vec3(0.35, 0.2, 0.5);
            gl_FragColor = vec4(color, 1.0);
          }
        `
        }
      />
    </mesh>
  );
}

export default function SpectrogramScene({
  analyserRef,
  isActive,
  isFrozen,
  baseColor = "#2b0f5c",
  highlightColor = "#d7a6ff",
}) {
  return (
    <div className="spectrogram-stage">
      <Canvas camera={{ position: [0, 1.8, 3.2], fov: 45 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 4, 2]} intensity={0.8} />
        <directionalLight position={[-2, 3, -2]} intensity={0.4} />
        <SpectrogramMesh
          analyserRef={analyserRef}
          isActive={isActive}
          isFrozen={isFrozen}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </Canvas>
    </div>
  );
}
