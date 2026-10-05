"use client";
import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Object3D, Color } from "three";

export default function ForestLight({sun=.35}) {
  const {camera}=useThree();
  useEffect(()=>{camera.layers.enable(1);},[camera]);
  const target=useMemo(()=>{const o=new Object3D();o.position.set(75,-3,0);return o;},[]);
  const color=new Color('#fff1d5').lerp(new Color('#ffd09b'),Math.abs(sun-.5));
  return <>
    <primitive object={target}/>
    <hemisphereLight layers={1} args={['#b9d6ef','#353d25',.65]}/>
    <directionalLight layers={1} position={[130,40+Math.sin(sun*Math.PI)*35,(sun-.5)*110]} target={target} color={color} intensity={2.5} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-90} shadow-camera-right={90} shadow-camera-top={65} shadow-camera-bottom={-65} shadow-camera-near={1} shadow-camera-far={230} shadow-normalBias={.1} shadow-bias={-.00015} onUpdate={light=>light.shadow.camera.layers.enable(1)}/>
  </>;
}
