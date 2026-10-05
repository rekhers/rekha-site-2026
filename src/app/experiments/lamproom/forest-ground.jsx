"use client";
import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, Color } from "three";

export default function ForestGround({ season }) {
  const { scene } = useGLTF("/models/lamproom/trees/ground.glb");
  const ground = useMemo(() => {
    const copy = scene.clone(true);
    const bounds = new Box3().setFromObject(copy);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    // One continuous scan covers the view, avoiding repeated tile seams and geometry.
    const scale = new Vector3(135 / size.x, .3 / size.y, 210 / size.z);
    copy.scale.multiply(scale);
    copy.position.set(-center.x * scale.x, -bounds.max.y * scale.y, -center.z * scale.z);
    copy.traverse(object => {
      if (!object.isMesh) return;
      object.receiveShadow = true;
      object.layers.set(1);
      const convert = source => {
        const material = source.clone();
        material.roughness = 1;
        if (season === 3) {
          material.color = new Color("#dce3e1");
          material.map = null;
        }
        return material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
    });
    return copy;
  }, [scene, season]);
  useEffect(() => () => ground.traverse(object => {
    if (object.isMesh) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose());
  }), [ground]);
  return <group position={[92.5,-13,0]}><primitive object={ground} dispose={null}/></group>;
}
