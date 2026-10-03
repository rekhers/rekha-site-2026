"use client";
import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

// Transparent lettering on a world-space plane shares the scene's depth buffer.
export default function WallText({ blocks, width = 4, color = "#302e29", ...props }) {
  const signature = JSON.stringify(blocks);
  const { texture, height } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const lines = [];
    let y = 12;
    for (const block of JSON.parse(signature)) {
      const size = block.size || 38;
      const font = `${size}px ${block.sans ? "Arial, sans-serif" : "Baskerville, Georgia, serif"}`;
      ctx.font = font;
      let line = "";
      for (const word of block.text.split(/\s+/)) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > 1160) {
          lines.push({ text: line, y, font });
          y += size * 1.45;
          line = word;
        } else line = next;
      }
      lines.push({ text: line, y, font });
      y += size * 1.45 + (block.gap ?? 28);
    }
    canvas.width = 1200;
    canvas.height = Math.ceil(y);
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    for (const line of lines) {
      ctx.font = line.font;
      ctx.fillText(line.text, 20, line.y);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    return { texture, height: width * canvas.height / canvas.width };
  }, [signature, width, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.01} depthTest depthWrite toneMapped={false} />
    </mesh>
  );
}
