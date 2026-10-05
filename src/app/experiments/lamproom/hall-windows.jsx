function Piece({p,s,color="#e6decd"}) { return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={color} roughness={.75}/></mesh>; }
function Sash({width,position,rotation=0}) {
  return <group position={position} rotation={[0,rotation,0]}>
    <mesh><planeGeometry args={[width,3]}/><meshPhysicalMaterial color="#eef4ef" transparent opacity={.055} depthWrite={false}/></mesh>
    {[-width/2,width/2].map(x=><Piece key={x} p={[x,0,.06]} s={[.09,3.18,.14]}/>)}
    {[-1.55,0,1.55].map(y=><Piece key={y} p={[0,y,.06]} s={[width+.1,.09,.14]}/>)}
    <Piece p={[0,0,.06]} s={[.035,3,.1]}/>
    {[-.75,.75].map(y=><Piece key={y} p={[0,y,.06]} s={[width,.035,.1]}/>)}
  </group>;
}
export default function HallWindows(){
  return <group position={[14.2,0,.5]} rotation={[0,-Math.PI/2,0]}>
    <Piece p={[0,1.7,0]} s={[7.4,3.4,.18]} color="#c6b9a5"/>
    <Piece p={[0,7.2,0]} s={[7.4,1.6,.18]} color="#c6b9a5"/>
    {[[-3.075,1.25],[0,1.9],[3.075,1.25]].map(([x,w])=><Piece key={x} p={[x,4.9,0]} s={[w,3,.18]} color="#c6b9a5"/>)}
    {[-1.7,1.7].map(x=><group key={x} position={[x,4.9,0]}>
      <Sash width={1} position={[0,0,-.65]}/>
      <Sash width={Math.hypot(.25,.65)} position={[-.625,0,-.325]} rotation={-Math.atan2(.65,.25)}/>
      <Sash width={Math.hypot(.25,.65)} position={[.625,0,-.325]} rotation={Math.atan2(.65,.25)}/>
      <Piece p={[0,-1.6,-.2]} s={[1.8,.16,1.1]}/>
      <Piece p={[0,1.6,-.2]} s={[1.8,.16,1.1]}/>

      {[-.79,.79].map(x=><Piece key={x} p={[x,0,.1]} s={[.13,3.25,.18]}/>)}
      {[-1.55,1.55].map(y=><Piece key={y} p={[0,y,.1]} s={[1.76,.14,.18]}/>)}
      <Piece p={[0,1.67,.12]} s={[1.9,.1,.22]}/><Piece p={[0,-1.63,.2]} s={[1.9,.12,.42]}/>
      <Piece p={[0,-1.8,.1]} s={[1.55,.22,.12]}/>


      <rectAreaLight position={[0,0,.2]} rotation={[0,Math.PI,0]} width={1.4} height={2.8} intensity={2} color="#eaf0ee"/>
    </group>)}
  </group>;
}
