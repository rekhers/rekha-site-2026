"use client";
import { useMemo } from "react";
import { Object3D, Color } from "three";
import Forest from "./forest";
import Skylight from "./skylight";

export default function Loft({ sun, season, skylight }) {
  const target=useMemo(()=>{const o=new Object3D();o.position.set(13,0,0);return o;},[]);
  const color=new Color('#fff7e5').lerp(new Color('#ffd09a'),Math.abs(sun-.5)*1.5);
  const boxes=[
    [[14,2.8,-7],[14,5.6,.18]],[[9,2.8,7],[4,5.6,.18]],[[17.5,2.8,7],[7,5.6,.18]],[[12.5,4.6,7],[3,2,.18]],[[9.25,5.6,0],[4.5,.18,14]],[[18.75,5.6,0],[4.5,.18,14]],[[14,5.6,-4.5],[5,.18,5]],[[14,5.6,4.5],[5,.18,5]],
    [[7,2.8,0],[.18,5.6,14]],
    [[21,.4,0],[.18,.8,14]],[[21,5.25,0],[.18,.7,14]],
    [[21,2.85,-6.5],[.18,4.1,1]],[[21,2.85,6.5],[.18,4.1,1]],
  ];
  return <>
    {boxes.map(([p,s],i)=><mesh key={i} position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color="#f5f3eb" roughness={.85}/></mesh>)}
    <Forest season={season} sun={sun} />
    <Skylight open={skylight}/>
    <mesh position={[21.05,2.85,0]} rotation={[0,-Math.PI/2,0]}>
      <planeGeometry args={[12,4.1]}/>
      <meshPhysicalMaterial color="#eef6fa" transparent opacity={0.055} roughness={0.08} metalness={0} depthWrite={false}/>
    </mesh>
    {[-6,-4,-2,0,2,4,6].map(z=><mesh key={z} position={[20.94,2.85,z]} castShadow><boxGeometry args={[.24,4.2,.13]}/><meshStandardMaterial color="#e5ddcc" roughness={.65}/></mesh>)}
    {[.8,2.15,3.5,4.9].map(y=><mesh key={y} position={[20.94,y,0]} castShadow><boxGeometry args={[.24,.11,12]}/><meshStandardMaterial color="#e5ddcc" roughness={.65}/></mesh>)}
    <mesh position={[20.75,.82,0]} castShadow receiveShadow><boxGeometry args={[.6,.12,12.3]}/><meshStandardMaterial color="#e5ddcc"/></mesh>
    <primitive object={target}/>
    <directionalLight position={[32,6+Math.sin(sun*Math.PI)*9,(sun-.5)*22]} target={target} color={color} intensity={3.4} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-17} shadow-camera-right={17} shadow-camera-top={15} shadow-camera-bottom={-15} shadow-camera-near={1} shadow-camera-far={60} shadow-normalBias={.025} shadow-bias={-.0001}/>
    <rectAreaLight position={[20.7,3,0]} rotation={[0,Math.PI/2,0]} width={11} height={4} color="#edf3ff" intensity={1.5}/>
  </>;
}
