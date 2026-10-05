"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, Shape, DoubleSide } from "three";

export default function Skylight({ open = 0 }) {
  const sash = useRef(null);
  const cheek = useMemo(() => {
    const s=new Shape();s.moveTo(-2.5,0);s.lineTo(2.5,0);s.lineTo(2.5,1);s.lineTo(-2.5,.12);s.closePath();return s;
  },[]);
  useFrame((_,dt)=>{sash.current.rotation.z=MathUtils.damp(sash.current.rotation.z,.174+open*.65,5,dt);});
  return <group position={[14,5.6,0]}>
    {[-2,2].map(z=><mesh key={z} position={[0,0,z]} castShadow><shapeGeometry args={[cheek]}/><meshStandardMaterial color="#eee7d9" side={DoubleSide}/></mesh>)}
    {[[-2.5,.06,.12],[2.5,.5,1]].map(([x,y,h])=><mesh key={x} position={[x,y,0]} castShadow><boxGeometry args={[.13,h,4.1]}/><meshStandardMaterial color="#eee7d9"/></mesh>)}
    <group ref={sash} position={[-2.5,.12,0]} rotation={[0,0,.174]}>
      <mesh position={[2.54,0,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[5.08,4]}/><meshPhysicalMaterial color="#e5f0f4" transparent opacity={.07} roughness={.1} side={DoubleSide} depthWrite={false}/></mesh>
      {[0,2.54,5.08].map(x=><mesh key={x} position={[x,0,0]} castShadow><boxGeometry args={[.1,.12,4.2]}/><meshStandardMaterial color="#e5ddcc"/></mesh>)}
      {[-2,0,2].map(z=><mesh key={z} position={[2.54,0,z]} castShadow><boxGeometry args={[5.18,.12,.1]}/><meshStandardMaterial color="#e5ddcc"/></mesh>)}
    </group>
    <rectAreaLight position={[0,-.1,0]} rotation={[-Math.PI/2,0,0]} width={4.7} height={3.7} intensity={1.3+open*.5} color="#edf4ff"/>
  </group>;
}
