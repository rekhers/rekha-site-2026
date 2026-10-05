"use client";
import { useMemo } from "react";
import { Shape, DoubleSide } from "three";
import HallWindows from "./hall-windows";

function Trim({ position, size, color = "#d2c3ac" }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.75}/></mesh>;
}
function Arch() {
  const corners=useMemo(()=>{
    const s=new Shape();s.moveTo(-2,3.6);s.lineTo(2,3.6);s.lineTo(2,1.5);s.absarc(0,1.5,2,0,Math.PI,false);s.lineTo(-2,3.6);return s;
  },[]);
  return <group position={[6.87,0,2.5]} rotation={[0,-Math.PI/2,0]}>
    <mesh><shapeGeometry args={[corners]}/><meshStandardMaterial color="#b9ab95" side={DoubleSide} roughness={.95}/></mesh>
    {[0,.11].map((depth,i)=><mesh key={i} position={[0,1.5,depth]}><torusGeometry args={[2-i*.065,.045,8,64,Math.PI]}/><meshStandardMaterial color="#d6c6ae" roughness={.7}/></mesh>)}
    {[-1,1].map(side=><group key={side}>
      <Trim position={[side*1.96,.75,.065]} size={[.14,1.5,.16]}/>
      <Trim position={[side*1.96,.16,.09]} size={[.23,.32,.23]}/>
      <Trim position={[side*1.96,1.48,.09]} size={[.23,.14,.23]}/>
    </group>)}
  </group>;
}
export default function ArchitectureDetails(){
  return <>
    <Arch/>
    {/* Stepped cornices and picture rails, inset from the wall surfaces. */}
    {[{x:0,y:0,z:0,height:4.6,color:'#d2c3ac'},{x:14,y:4,z:-10,height:5.6,color:'#eeeae1'}].map((room,i)=><group key={i} position={[room.x,room.y,room.z]}>
      {[[-.24,.12,.24],[-.13,.1,.32],[-.045,.08,.4]].map(([offset,h,depth],j)=><group key={j}>
        <Trim position={[0,room.height+offset,-6.88]} size={[13.8,h,depth]} color={room.color}/>
        <Trim position={[0,room.height+offset,6.88]} size={[13.8,h,depth]} color={room.color}/>
        <Trim position={[-6.88,room.height+offset,0]} size={[depth,h,13.8]} color={room.color}/>
        {i===0 && <Trim position={[6.88,room.height+offset,0]} size={[depth,h,13.8]} color={room.color}/>}
      </group>)}
      <Trim position={[-6.86,room.height-.8,0]} size={[.055,.045,13.7]} color={room.color}/>
      <Trim position={[0,room.height-.8,-6.86]} size={[13.7,.045,.055]} color={room.color}/>
    </group>)}
    {/* Stairwell walls enclose the turn without blocking either landing. */}
    <HallWindows/>
    <Trim position={[10.6,4,4.2]} size={[7.4,8,.18]} color="#c6b9a5"/>
    <Trim position={[9,4,.91]} size={[4.14,8,.18]} color="#c6b9a5"/>
    <Trim position={[10.93,4,-1]} size={[.14,8,4.18]} color="#c6b9a5"/>
    <Trim position={[7.02,6.3,2.6]} size={[.18,3.4,3.2]} color="#c6b9a5"/>
    <Trim position={[12.5,2,-3.09]} size={[3.2,4,.18]} color="#c6b9a5"/>
    <Trim position={[10.6,-.09,.5]} size={[7.4,.18,7.4]} color="#9b734b"/>
    <Trim position={[10.6,8,.5]} size={[7.4,.16,7.4]} color="#d3c7b4"/>
    {[7.7,8.7,9.7,10.7,11.7,12.7,13.7].map(x=><group key={x}>
      <Trim position={[x,1.25,4.08]} size={[.045,2.1,.035]} color="#e0d0b7"/>
    </group>)}
    <Trim position={[10.6,2.3,4.06]} size={[7,.07,.065]} color="#e0d0b7"/>
  </>;
}
