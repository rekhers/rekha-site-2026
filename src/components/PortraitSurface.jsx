"use client";

import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace, MathUtils, BufferGeometry, Float32BufferAttribute } from "three";

class SurfaceBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Photograph({ hover }) {
  const loaded = useLoader(TextureLoader, "/bio-pic.jpg");

  const texture = useMemo(() => {
    const copy = loaded.clone();
    copy.colorSpace = SRGBColorSpace;
    copy.needsUpdate = true;
    return copy;
  }, [loaded]);
  useEffect(() => () => texture.dispose(), [texture]);
  const material = useRef();
  const geometry = useMemo(() => {
    const positions = [], centers = [], seeds = [], uvs = [], brushUvs = [];
    const columns = 9, rows = 14;
    const corners = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      const hash = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
      const index = y * columns + x;
      for (const [cx, cy] of corners) {
        positions.push((cx - 0.5) * 2 / columns, (cy - 0.5) * 2 / rows, 0);
        centers.push((x + 0.5) / columns * 2 - 1, (y + 0.5) / rows * 2 - 1);
        seeds.push(hash(index), hash(index + 10000), hash(index + 20000));
        uvs.push((x + cx) / columns, (y + cy) / rows);
        brushUvs.push(cx, cy);
      }
    }
    const result = new BufferGeometry();
    result.setAttribute("position", new Float32BufferAttribute(positions, 3));
    result.setAttribute("aCenter", new Float32BufferAttribute(centers, 2));
    result.setAttribute("aSeed", new Float32BufferAttribute(seeds, 3));
    result.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    result.setAttribute("aBrushUv", new Float32BufferAttribute(brushUvs, 2));
    return result;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => {
    return { photo: { value: texture }, time: { value: 0 }, energy: { value: 1 } };
  }, [texture]);
  useFrame((_, delta) => {
    if (!material.current) return;
    const current = material.current.uniforms;
    current.time.value += Math.min(delta, 0.05);
    current.energy.value = MathUtils.damp(current.energy.value, hover.current ? 0 : 1, 1.25, Math.min(delta, 0.05));
    if (current.energy.value < 0.001) current.energy.value = 0;
  });
  return (
    <>
    <color attach="background" args={["#ffffff"]} />
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        vertexShader={`
          uniform float time;
          uniform float energy;
          attribute vec2 aCenter;
          attribute vec3 aSeed;
          attribute vec2 aBrushUv;
          varying vec2 vUv;
          varying vec2 vCenter;
          varying vec2 vBrushUv;
          varying vec3 vSeed;
          void main() {
            vUv = uv;
            vCenter = aCenter * 0.5 + 0.5;
            vBrushUv = aBrushUv;
            vSeed = aSeed;
            float amount = smoothstep(aSeed.z * 0.1, 0.8 + aSeed.z * 0.2, energy);
            vec2 drift = (aSeed.xy - 0.5) * vec2(0.52, 0.4);
            drift += vec2(sin(time * 0.22 + aSeed.x * 20.0), cos(time * 0.18 + aSeed.y * 20.0)) * 0.025;
            vec2 center = aCenter + drift * amount;
            float angle = (aSeed.z - 0.5) * 3.2 * amount;
            mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            vec2 brush = position.xy * mix(vec2(1.0), vec2(1.7 + aSeed.x * 0.5, 2.0 + aSeed.y * 0.6), amount);
            gl_Position = vec4(center + rotation * brush, 0.0, 1.0);
          }`}
        fragmentShader={`
          uniform sampler2D photo;
          uniform float energy;
          varying vec2 vUv;
          varying vec2 vCenter;
          varying vec2 vBrushUv;
          varying vec3 vSeed;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
          }
          void main() {
            vec4 photoColor = texture2D(photo, vUv);
            vec3 blurred = texture2D(photo, vCenter).rgb * 0.4;
            blurred += texture2D(photo, clamp(vCenter + vec2(0.025, 0.0), 0.0, 1.0)).rgb * 0.15;
            blurred += texture2D(photo, clamp(vCenter - vec2(0.025, 0.0), 0.0, 1.0)).rgb * 0.15;
            blurred += texture2D(photo, clamp(vCenter + vec2(0.0, 0.025), 0.0, 1.0)).rgb * 0.15;
            blurred += texture2D(photo, clamp(vCenter - vec2(0.0, 0.025), 0.0, 1.0)).rgb * 0.15;
            float luminance = dot(blurred, vec3(0.2126, 0.7152, 0.0722));
            vec2 p = vBrushUv * 2.0 - 1.0;
            float grain = noise(vBrushUv * 85.0 + vSeed.xy * 70.0);
            vec2 warped = p + vec2(0.14 * sin(p.y * 2.8 + vSeed.x), 0.08 * sin(p.x * 3.0));
            float radius = length(warped * vec2(1.08, 0.86));
            float rings = sin(radius * 100.0 + noise(p * 3.0 + vSeed.xy * 9.0) * 4.0);
            float ridges = smoothstep(-0.4, 0.45, rings);
            float edge = length(p * vec2(1.05, 0.9)) + (grain - 0.5) * 0.10;
            float mask = 1.0 - smoothstep(0.78, 1.0, edge);
            mask *= mix(0.42, 0.94, ridges) * (0.8 + grain * 0.2);
            float gradient = clamp(vBrushUv.y * 0.55 + vBrushUv.x * 0.25 + vSeed.z * 0.2, 0.0, 1.0);
            vec3 pigment = mix(vec3(0.045, 0.008, 0.17), vec3(0.50, 0.24, 0.85), gradient);
            pigment = mix(pigment, vec3(0.72, 0.57, 0.94), luminance * 0.35);
            pigment *= 0.88 + grain * 0.2;
            float paint = smoothstep(0.0, 0.75, energy);
            gl_FragColor = vec4(mix(photoColor.rgb, pigment, paint), mix(1.0, mask, paint));
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
    </>
  );
}

export default function PortraitSurface({ active, onUnavailable }) {
  const hover = useRef(0);
  return (
    <SurfaceBoundary onUnavailable={onUnavailable}>
      <div style={{ width: "100%", height: "100%" }} onPointerEnter={() => { hover.current = 1; }} onPointerLeave={() => { hover.current = 0; }}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: false }}
        fallback={null}
      >
        <Suspense fallback={null}><Photograph hover={hover} /></Suspense>
      </Canvas>
      </div>
    </SurfaceBoundary>
  );
}
