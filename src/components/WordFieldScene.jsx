"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DataTexture,
  RedFormat,
  UnsignedByteType,
  LinearFilter,
  ClampToEdgeWrapping,
  Color,
  Vector2,
} from "three";

const GRID_X = 180;
const GRID_Y = 90;

function buildMaskTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = GRID_X;
  canvas.height = GRID_Y;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font =
    "600 30px 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const data = new Uint8Array(GRID_X * GRID_Y);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = imageData[i * 4];
  }

  const texture = new DataTexture(
    data,
    GRID_X,
    GRID_Y,
    RedFormat,
    UnsignedByteType
  );
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function WordFieldMesh({ text }) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const [maskTexture, setMaskTexture] = useState(null);
  const previousMaskRef = useRef(null);
  const transitionStartRef = useRef(0);
  const TRANSITION_DURATION = 0.7;
  const mouseRef = useRef(new Vector2(0.5, 0.5));
  const { size } = useThree();

  useEffect(() => {
    const nextTexture = buildMaskTexture(text || "hello");
    if (maskTexture) {
      previousMaskRef.current = maskTexture;
      transitionStartRef.current = performance.now();
    }
    setMaskTexture(nextTexture);
  }, [text]);

  useEffect(() => {
    const handleMove = (event) => {
      const x = event.clientX / size.width;
      const y = 1 - event.clientY / size.height;
      mouseRef.current.set(x, y);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [size.width, size.height]);

  const uniformsRef = useRef({
    uMask: { value: null },
    uPrevMask: { value: null },
    uMix: { value: 1 },
    uTime: { value: 0 },
    uMouse: { value: mouseRef.current },
    uColor: { value: new Color("#00bcd4") },
    uGlow: { value: new Color("#38f2ff") },
    uAccent: { value: new Color("#8ff8ff") },
  });

  useEffect(() => {
    uniformsRef.current.uMask.value = maskTexture;
    uniformsRef.current.uPrevMask.value = previousMaskRef.current || maskTexture;
    if (materialRef.current) {
      materialRef.current.uniformsNeedUpdate = true;
    }
  }, [maskTexture]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uMouse.value = mouseRef.current;
    if (meshRef.current) {
      const tiltX = (mouseRef.current.y - 0.5) * 0.25;
      const tiltY = (mouseRef.current.x - 0.5) * 0.4;
      meshRef.current.rotation.x = -0.35 + tiltX;
      meshRef.current.rotation.y = tiltY;
    }
    if (!transitionStartRef.current) {
      materialRef.current.uniforms.uMix.value = 1;
      return;
    }
    const elapsed = (performance.now() - transitionStartRef.current) / 1000;
    const mix = Math.min(elapsed / TRANSITION_DURATION, 1);
    materialRef.current.uniforms.uMix.value = mix;
    if (mix >= 1) {
      transitionStartRef.current = 0;
    }
  });

  if (!maskTexture) return null;

  return (
    <group>
      <mesh rotation={[-0.35, 0, 0]} position={[0, 0, -0.12]}>
        <planeGeometry args={[5, 2.8, 20, 12]} />
        <meshBasicMaterial color="#29c3d2" transparent opacity={0.1} wireframe />
      </mesh>
      <mesh ref={meshRef} rotation={[-0.35, 0, 0]}>
        <planeGeometry args={[4, 2.2, GRID_X - 1, GRID_Y - 1]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniformsRef.current}
          vertexShader={
            /* glsl */ `
            varying vec2 vUv;
            varying float vMask;
            uniform sampler2D uMask;
            uniform sampler2D uPrevMask;
            uniform float uMix;
            uniform float uTime;
            uniform vec2 uMouse;

            float ripple(vec2 uv, vec2 center) {
              float d = distance(uv, center);
              return sin(12.0 * d - uTime * 2.0) * 0.03;
            }

            void main() {
              vUv = uv;
              vec2 sampleUv = vec2(uv.x, 1.0 - uv.y);
              float mask = texture2D(uMask, sampleUv).r;
              float prevMask = texture2D(uPrevMask, sampleUv).r;
              float mixedMask = mix(prevMask, mask, uMix);
              vMask = mixedMask;
              vec3 pos = position;
              pos.z += mixedMask * 0.45;
              pos.z += ripple(uv, uMouse);
              pos.z += sin((uv.x + uTime * 0.15) * 6.0) * 0.02;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `
          }
          fragmentShader={
            /* glsl */ `
            varying vec2 vUv;
            varying float vMask;
            uniform vec3 uColor;
            uniform vec3 uGlow;
            uniform vec3 uAccent;
            uniform float uTime;

            void main() {
              float edge = smoothstep(0.2, 0.9, vMask);
              float stripe = step(0.5, fract(vUv.y * 28.0));
              float shutter = mix(0.92, 1.08, stripe);
              float shimmer = 0.18 * sin((vUv.x + uTime * 0.2) * 10.0);
              float band = smoothstep(0.0, 1.0, vUv.y);
              vec3 base = mix(uColor * 0.25, uColor, edge);
              vec3 glowMix = mix(uGlow, uAccent, band);
              vec3 color = mix(base, glowMix, edge * 0.8 + shimmer);
              color *= shutter;
              float alpha = smoothstep(0.05, 0.25, vMask);
              gl_FragColor = vec4(color, alpha);
            }
          `
          }
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function WordFieldScene({ text }) {
  return (
    <div className="wordfield-stage">
      <Canvas camera={{ position: [0, 1.6, 3.2], fov: 45 }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 4, 2]} intensity={0.6} />
        <pointLight position={[-2, 1.5, 2]} intensity={0.6} color="#38f2ff" />
        <pointLight position={[2, -1, 2]} intensity={0.5} color="#00bcd4" />
        <WordFieldMesh text={text} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
