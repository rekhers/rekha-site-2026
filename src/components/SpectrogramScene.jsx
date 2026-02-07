"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  DataTexture,
  RedFormat,
  UnsignedByteType,
  LinearFilter,
  NearestFilter,
  ClampToEdgeWrapping,
  Vector3,
} from "three";

const DEFAULT_BINS = 128;
const DEFAULT_HISTORY = 128;

function SpectrogramMesh({ analyserRef, isActive }) {
  const meshRef = useRef(null);
  const width = DEFAULT_BINS;
  const height = DEFAULT_HISTORY;

  const dataTexture = useMemo(() => {
    const data = new Uint8Array(width * height);
    const texture = new DataTexture(
      data,
      width,
      height,
      RedFormat,
      UnsignedByteType
    );
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, [width, height]);

  const scratch = useMemo(() => new Uint8Array(width), [width]);
  const displacement = 1.05;

  useFrame(({ clock }) => {
    const analyser = analyserRef.current;
    if (!analyser || !isActive) return;

    analyser.getByteFrequencyData(scratch);
    const data = dataTexture.image.data;

    data.copyWithin(width, 0, width * (height - 1));
    for (let i = 0; i < width; i += 1) {
      data[i] = scratch[i];
    }

    dataTexture.needsUpdate = true;

    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-0.6, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[3.4, 2.2, width - 1, height - 1]} />
      <shaderMaterial
        uniforms={{
          uData: { value: dataTexture },
          uTime: { value: 0 },
          uDisplacement: { value: displacement },
          uLight: { value: new Vector3(0.6, 1.0, 0.4) },
        }}
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
            intensity = pow(intensity, 2.2);
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

          vec3 palette(float t) {
            t = clamp(t, 0.0, 1.0);
            vec3 c1 = vec3(0.04, 0.05, 0.12);
            vec3 c2 = vec3(0.22, 0.1, 0.45);
            vec3 c3 = vec3(0.78, 0.18, 0.55);
            vec3 c4 = vec3(0.98, 0.78, 0.22);
            float mid = smoothstep(0.0, 0.45, t);
            float hi = smoothstep(0.45, 1.0, t);
            return mix(mix(c1, c2, mid), mix(c3, c4, hi), hi);
          }

          void main() {
            float intensity = pow(vIntensity, 1.1);
            float edge = smoothstep(0.15, 0.95, intensity);
            vec3 color = palette(intensity);
            color *= 0.55 + edge * 1.6;
            gl_FragColor = vec4(color, 1.0);
          }
        `
        }
      />
    </mesh>
  );
}

export default function SpectrogramScene({ analyserRef, isActive }) {
  return (
    <div className="spectrogram-stage">
      <Canvas camera={{ position: [0, 1.8, 3.2], fov: 45 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 4, 2]} intensity={0.8} />
        <directionalLight position={[-2, 3, -2]} intensity={0.4} />
        <SpectrogramMesh analyserRef={analyserRef} isActive={isActive} />
      </Canvas>
    </div>
  );
}
