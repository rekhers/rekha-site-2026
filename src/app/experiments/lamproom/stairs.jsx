"use client";
import { useMemo } from "react";
import { Shape } from "three";

export function floorHeight(x, z) {
  if(x>6.6 && x<=11 && z>1.25 && z<3.75) return Math.max(0,(x-7)/2);
  if(x>=11 && x<13.75 && z>=1 && z<3.75) return 2;
  if(x>11.25 && x<13.75 && z<=1 && z>=-3.4) return Math.min(4,2+(1-z)/2);
  if(x>7.35 && x<20.65 && z<-3.35 && z>-16.65) return 4;
  return null;
}
function StairPanel({position,rotation=0}) {
  const shape=useMemo(()=>{const s=new Shape();s.moveTo(0,0);s.lineTo(4,2);s.lineTo(4,2.9);s.lineTo(0,.9);s.closePath();return s;},[]);
  return <group position={position} rotation={[0,rotation,0]}>
    <mesh position={[0,0,-.09]} castShadow receiveShadow><extrudeGeometry args={[shape,{depth:.18,bevelEnabled:false}]}/><meshStandardMaterial color="#d1c1a8" roughness={.8}/></mesh>
    {[.12,.8].map(y=><mesh key={y} position={[2,1+y,.015]} rotation={[0,0,Math.atan(.5)]}><boxGeometry args={[Math.sqrt(20),.045,.23]}/><meshStandardMaterial color="#e5d7bf"/></mesh>)}
    <mesh position={[2,1.94,0]} rotation={[0,0,Math.atan(.5)]}><boxGeometry args={[Math.sqrt(20)+.08,.09,.28]}/><meshStandardMaterial color="#85613f" roughness={.6}/></mesh>
    {[.35,1.15,1.95,2.75,3.55].map(x=><mesh key={x} position={[x,x*.5+.45,0]}><boxGeometry args={[.045,.63,.23]}/><meshStandardMaterial color="#e5d7bf"/></mesh>)}
  </group>;
}
export default function Stairs(){
  const steps=Array.from({length:12},(_,i)=>({x:7+(i+.5)/3,y:(i+1)/6,z:2.5}));
  const second=Array.from({length:12},(_,i)=>({x:12.5,y:2+(i+1)/6,z:1-(i+.5)/3}));
  return <group>
    {[...steps,...second].map((p,i)=><mesh key={i} position={[p.x,p.y/2,p.z]} castShadow receiveShadow><boxGeometry args={i<12?[1/3,p.y,3]:[3,p.y,1/3]}/><meshStandardMaterial color={i%2?'#997049':'#a47b52'} roughness={.7}/></mesh>)}
    <mesh position={[12.5,1,2.5]} castShadow receiveShadow><boxGeometry args={[3,2,3]}/><meshStandardMaterial color="#9b734b" roughness={.7}/></mesh>
    {[1,4].map(z=><StairPanel key={z} position={[7,0,z]}/>)}
    {[11,14].map(x=><StairPanel key={x} position={[x,2,1]} rotation={Math.PI/2}/>)}
    <pointLight position={[11,5,2]} intensity={18} color="#ffe4bd" distance={12}/>
  </group>;
}
