"use client";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

function Model({ file, height, width, position, rotation = 0 }) {
  const { scene } = useGLTF(`/models/lamproom/${file}.glb`);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    const bounds = new Box3().setFromObject(copy);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = width ? width / size.x : height / size.y;
    copy.scale.multiplyScalar(scale);
    copy.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
    copy.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = file !== "rug";
      object.receiveShadow = true;
    });
    return copy;
  }, [scene, height, width, file]);
  // Cached geometry and materials belong to useGLTF and are shared by instances.
  return <group position={position} rotation={[0, rotation, 0]}><primitive object={model} dispose={null} /></group>;
}

function Lamp({ file, position, height, color, brightness, rotation = 0, bulb = 0.8, power = 22 }) {
  return (
    <group position={position}>
      <Model file={file} height={height} position={[0, 0, 0]} rotation={rotation} />
      <pointLight position={[0, height * bulb, 0]} color={color} intensity={power * brightness} distance={7} decay={2} />
    </group>
  );
}

export default function Furniture({ color, brightness }) {
  return (
    <group>
      <Model file="rug" width={5.4} position={[0, 0.008, -0.8]} />
      <Model file="display-table" height={0.82} position={[0, 0, -3.7]} />
      <Model file="marble-table" height={0.72} position={[-3.1, 0, -1.1]} />
      <Model file="marble-table" height={0.72} position={[3.1, 0, -1.1]} rotation={Math.PI} />
      <Lamp file="classic-lamp" position={[-3.1, 0.72, -1.1]} height={0.58} color={color} brightness={brightness} />
      <Lamp file="table-lamp" position={[3.1, 0.72, -1.1]} height={0.6} color={color} brightness={brightness} />
      <Lamp file="desk-lamp" position={[-0.65, 0.82, -3.7]} height={0.62} color={color} brightness={brightness} rotation={0.35} power={16} />
      <Lamp file="floor-lamp" position={[5.3, 0, -5.3]} height={1.9} color={color} brightness={brightness} power={38} />
    </group>
  );
}
