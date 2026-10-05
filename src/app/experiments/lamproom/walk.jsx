"use client";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import { floorHeight } from "./stairs";

export function walkable(x, z) {
  if (floorHeight(x,z) !== null) return true;
  if (z < -6.6 || z > 6.6 || x < -6.6 || x > 6.6) return false;
  if (Math.abs(x) < 1.7 && Math.abs(z + 3.7) < .75) return false;
  if ([-3.1, 3.1].some(cx => Math.hypot(x-cx,z+1.1)<.85)) return false;
  return Math.hypot(x-5.3,z+5.3)>.65;
}
export default function Walk({ onStartedWalking }) {
  const distance = useRef(0);
  const announced = useRef(false);
  const { gl } = useThree();
  const keys = useRef(new Set());
  const drag = useRef(null);
  const angle = useRef({yaw:0,pitch:0});
  useEffect(() => {
    const canvas = gl.domElement;
    const clear = () => {keys.current.clear();drag.current=null;};
    const down = e => {
      if (/INPUT|BUTTON|A|TEXTAREA/.test(e.target.tagName)) return;
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){e.preventDefault();keys.current.add(e.key);}
    };
    const up = e => keys.current.delete(e.key);
    const start = e => { if(drag.current) return; canvas.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,start:performance.now(),touch:e.pointerType==='touch'}; };
    const move = e => {const d=drag.current;if(!d||d.id!==e.pointerId)return;angle.current.yaw-=(e.clientX-d.x)*.004;angle.current.pitch=MathUtils.clamp(angle.current.pitch-(e.clientY-d.y)*.003,-.7,.7);d.x=e.clientX;d.y=e.clientY;};
    const stop = e => {if(drag.current?.id===e.pointerId)drag.current=null;};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
    canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('lostpointercapture',stop);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);canvas.removeEventListener('pointerdown',start);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',stop);canvas.removeEventListener('pointercancel',stop);canvas.removeEventListener('lostpointercapture',stop);clear();};
  },[gl]);
  useFrame(({camera},dt)=>{
    const k=keys.current, a=angle.current, step=Math.min(dt,.05);
    a.yaw+=((k.has('ArrowLeft')?1:0)-(k.has('ArrowRight')?1:0))*step*1.4;
    camera.rotation.set(a.pitch,a.yaw,0,'YXZ');
    const touch=drag.current?.touch && performance.now()-drag.current.start>220;
    const forward=(k.has('w')||k.has('ArrowUp')||touch?1:0)-(k.has('s')||k.has('ArrowDown')?1:0);
    const side=(k.has('d')?1:0)-(k.has('a')?1:0);
    const speed=3*step/Math.max(1,Math.hypot(forward,side));
    const dx=(-Math.sin(a.yaw)*forward+Math.cos(a.yaw)*side)*speed;
    const dz=(-Math.cos(a.yaw)*forward-Math.sin(a.yaw)*side)*speed;
    const previousX = camera.position.x, previousZ = camera.position.z;
    if(walkable(camera.position.x+dx,camera.position.z))camera.position.x+=dx;
    if(walkable(camera.position.x,camera.position.z+dz))camera.position.z+=dz;
    camera.position.y = MathUtils.damp(camera.position.y, (floorHeight(camera.position.x,camera.position.z) ?? 0) + 1.8, 14, step);
    distance.current += Math.hypot(camera.position.x - previousX, camera.position.z - previousZ);
    if (!announced.current && distance.current >= 1.3) {
      announced.current = true;
      onStartedWalking();
    }
  });
  return null;
}
