"use client";
import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Color, Matrix4, Object3D, Vector3, MeshStandardMaterial } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function TreeBatch({geometry, material, placements,foliage}) {
  const ref=useRef(null);
  useEffect(()=>{
    const object=new Object3D();
    placements.forEach((p,i)=>{object.position.set(p.x,p.y,p.z);object.scale.set(p.height*p.width,p.height,p.height*p.width);object.rotation.set(0,p.rotation,0);object.updateMatrix();ref.current.setMatrixAt(i,object.matrix);
      const tint = new Color().setHSL(foliage ? p.hue : .1, foliage ? p.saturation : .04, p.lightness);
      ref.current.setColorAt(i,tint);});
    ref.current.instanceMatrix.needsUpdate=true;
    ref.current.instanceColor.needsUpdate=true;ref.current.computeBoundingSphere();
  },[placements,foliage]);
  return <instancedMesh ref={ref} args={[geometry,material,placements.length]} layers={1} castShadow receiveShadow dispose={null}/>;
}
function Species({name,placements,season}) {
  const {scene}=useGLTF(`/models/lamproom/trees/${name}.glb`);
  const parts=useMemo(()=>{
    scene.updateMatrixWorld(true);
    const bounds=new Box3().setFromObject(scene),size=bounds.getSize(new Vector3()),center=bounds.getCenter(new Vector3());
    const normal=new Matrix4().makeScale(1/size.y,1/size.y,1/size.y).multiply(new Matrix4().makeTranslation(-center.x,-bounds.min.y,-center.z));
    const groups=new Map();
    scene.traverse(mesh=>{
      if(!mesh.isMesh)return;
      const source=mesh.material;
      if(Array.isArray(source)) return;
      const geometry=mesh.geometry.clone().applyMatrix4(new Matrix4().multiplyMatrices(normal,mesh.matrixWorld));
      const flat=geometry.index?geometry.toNonIndexed():geometry;
      if(flat!==geometry)geometry.dispose();
      // Retain only shared surface attributes to batch hundreds of birch pieces.
      for(const attribute of Object.keys(flat.attributes))if(!['position','normal','uv'].includes(attribute))flat.deleteAttribute(attribute);
      if(!groups.has(source))groups.set(source,[]);
      groups.get(source).push(flat);
    });
    return Array.from(groups,([source,geometries])=>{
      const geometry=mergeGeometries(geometries,false);
      geometries.forEach(g=>g.dispose());
      const material=new MeshStandardMaterial({
        map: source.map, normalMap: source.normalMap, roughnessMap: source.roughnessMap,
        alphaMap: source.alphaMap, color: source.color, side: source.side,
        roughness: .9, metalness: 0,
      });
      const foliage=/leav|branch|tree_1/i.test(source.name)||(name==='birch'&&source.transparent);
      const deciduous=name==='birch'||name==='beech';
      if(foliage){
        material.transparent=false;material.alphaTest=.4;material.depthWrite=true;
        if(deciduous&&season===3)material.visible=false;
        if(deciduous&&season!==1&&season!==3){
          const tint=new Color(season===0?'#abc66b':name==='birch'?'#dcb64f':'#bc672f');
          material.onBeforeCompile=shader=>{
            shader.uniforms.seasonTint={value:tint};
            shader.fragmentShader='uniform vec3 seasonTint;\n'+shader.fragmentShader;
            shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>\nfloat leafLight=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));\ndiffuseColor.rgb=mix(diffuseColor.rgb,seasonTint*leafLight*1.6,${season===2?'0.9':'0.4'});`);
          };
          material.customProgramCacheKey=()=>`${name}-${season}`;
        }
      }
      return {geometry,material,foliage};
    }).filter(p=>p.geometry);
  },[scene,name,season]);
  useEffect(()=>()=>parts.forEach(p=>{p.geometry.dispose();p.material.dispose();}),[parts]);
  return parts.map((part,i)=><TreeBatch key={i} {...part} placements={placements}/>);
}
function randomGenerator(){let seed=527;return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
export default function TreeModels({season}){
  const trees=useMemo(()=>{
    const rand=randomGenerator(),groups={pine:[],spruce:[],birch:[],beech:[]};
    for(let i=0;i<105;i++){
      const r=rand(),name=r<.38?'pine':r<.7?'spruce':r<.86?'birch':'beech';
      groups[name].push({x:31+rand()*105,y:-13.3,z:(rand()-.5)*180,height:(name==='pine'||name==='spruce'?20:16)+rand()*12,width:.8+rand()*.35,rotation:rand()*Math.PI*2,hue:.12+rand()*.2,saturation:.08+rand()*.25,lightness:.68+rand()*.27});
    }
    return groups;
  },[]);
  return <>{Object.entries(trees).map(([name,placements])=><Species key={name} name={name} placements={placements} season={season}/>)}</>;
}
