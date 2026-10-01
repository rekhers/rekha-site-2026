import { DataTexture, RepeatWrapping, RGBAFormat } from "three";

// Neutral, seamless microrelief; replace with authored PBR maps when selected.
export function surfaceTexture(repeats) {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  let seed = 73;
  for (let i = 0; i < size * size; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const value = 160 + Math.floor((seed / 4294967296) * 65);
    data.set([value, value, value, 255], i * 4);
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeats, repeats);
  texture.needsUpdate = true;
  return texture;
}
