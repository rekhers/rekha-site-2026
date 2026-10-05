"use client";
import { Suspense, useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

import ForestLight from "./forest-light";
import TreeModels from "./tree-models";
import ForestGround from "./forest-ground";

const palettes = [
  {pine:'#385a43',leaf:'#91ab59',ground:'#718068',haze:'#dce7e2'},
  {pine:'#294c3a',leaf:'#597d43',ground:'#596d50',haze:'#d7e3e5'},
  {pine:'#3c5542',leaf:'#bd773c',ground:'#88755b',haze:'#e6ddd0'},
  {pine:'#53665c',leaf:'#777870',ground:'#dce2df',haze:'#d8e2e9'},
];
export default function Forest({season=1,sun=.35}){
  const palette=palettes[season];
  const sky=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=32;canvas.height=512;
    const ctx=canvas.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,512);
    gradient.addColorStop(0,'#a7c9dd');gradient.addColorStop(.65,'#e1e9e5');gradient.addColorStop(1,'#eef0e6');ctx.fillStyle=gradient;ctx.fillRect(0,0,32,512);
    const sky=new CanvasTexture(canvas);sky.colorSpace=SRGBColorSpace;
    return sky;
  },[]);
  useEffect(()=>()=>sky.dispose(),[sky]);
  return <group>
    <ForestLight sun={sun}/>
    <mesh position={[220,35,0]} rotation={[0,-Math.PI/2,0]}><planeGeometry args={[850,350]}/><meshBasicMaterial map={sky} color={season===3?'#cbd6df':'#ffffff'} toneMapped={false}/></mesh>
    <mesh position={[130,-13.32,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[210,500]}/><meshBasicMaterial color={palette.ground}/></mesh>
    <Suspense fallback={null}><ForestGround season={season}/></Suspense>
    <Suspense fallback={null}><TreeModels season={season}/></Suspense>
  </group>;
}
