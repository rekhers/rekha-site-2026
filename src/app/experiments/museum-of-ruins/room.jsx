"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF, useTexture, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  Vector3,
  MathUtils,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

import { exhibits, rooms, canWalk, classroomDesk } from "./exhibits";
import { surfaceTexture } from "./materials";
import styles from "./museum.module.css";

function Navigator({ active, movementRef, onRoomChange, onVisibleRoomsChange }) {
  const keys = useRef(new Set());
  const currentRoom = useRef(0);
  const visibilityKey = useRef("0");

  const yaw = useRef(0),
    pitch = useRef(0),
    drag = useRef(null);

  useEffect(() => {
    const down = (e) => {
      if (!active || /INPUT|TEXTAREA|BUTTON/.test(e.target.tagName)) return;
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      ) {
        e.preventDefault();
        keys.current.add(e.key);
      }
    };
    const up = (e) => keys.current.delete(e.key);

    const clear = () => {
      keys.current.clear();
      drag.current = null;
      movementRef.current = { x: 0, y: 0 };
    };

    const start = (e) => {
      if (active && e.target.tagName === "CANVAS" && !drag.current) {
        drag.current = [e.clientX, e.clientY, e.pointerId];
        e.target.setPointerCapture(e.pointerId);
      }
    };

    const move = (e) => {
      if (!drag.current || drag.current[2] !== e.pointerId) return;
      yaw.current -= (e.clientX - drag.current[0]) * 0.004;
      pitch.current = MathUtils.clamp(
        pitch.current - (e.clientY - drag.current[1]) * 0.003,
        -0.65,
        0.65,
      );
      drag.current = [e.clientX, e.clientY, e.pointerId];
    };

    const endLook = (e) => {
      if (drag.current?.[2] === e.pointerId) drag.current = null;
    };
    window.addEventListener("pointercancel", endLook);
    document.addEventListener("visibilitychange", clear);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    window.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", endLook);
    return () => {
      clear();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", endLook);
      window.removeEventListener("pointercancel", endLook);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [active, movementRef]);

  useFrame(({ camera }, dt) => {
    if (!active) return;
    const k = keys.current,
      d = Math.min(dt, 0.05);
    yaw.current +=
      ((k.has("ArrowLeft") ? 1 : 0) - (k.has("ArrowRight") ? 1 : 0)) * d * 1.4;
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    const forward =
      (k.has("ArrowUp") || k.has("w") ? 1 : 0) -
      (k.has("ArrowDown") || k.has("s") ? 1 : 0) +
      movementRef.current.y;
    const side =
      (k.has("d") ? 1 : 0) - (k.has("a") ? 1 : 0) + movementRef.current.x;
    const speed = (2.5 * d) / Math.max(1, Math.hypot(forward, side));
    const dx =
      (-Math.sin(yaw.current) * forward + Math.cos(yaw.current) * side) * speed;
    const dz =
      (-Math.cos(yaw.current) * forward - Math.sin(yaw.current) * side) * speed;
    const roomIndex = rooms.findIndex(
      (room) =>
        camera.position.z <= room.front && camera.position.z >= room.back,
    );
    if (roomIndex >= 0) {
      const visible = [roomIndex];
      const room = rooms[roomIndex];
      if (
        roomIndex < rooms.length - 1 &&
        camera.position.z < room.back + 1.8 &&
        Math.abs(camera.position.x) < 1.8
      )
        visible.push(roomIndex + 1);
      const key = visible.join(",");
      if (key !== visibilityKey.current) {
        visibilityKey.current = key;
        onVisibleRoomsChange(visible);
      }
    }
    if (roomIndex >= 0 && roomIndex !== currentRoom.current) {
      currentRoom.current = roomIndex;
      onRoomChange(roomIndex);
    }
    if (canWalk(camera.position.x + dx, camera.position.z))
      camera.position.x += dx;
    if (canWalk(camera.position.x, camera.position.z + dz))
      camera.position.z += dz;
  });
  return null;
}
function Exhibit({ item, onSelect, textVisible }) {
  return (
    <group position={item.position} rotation={item.rotation}>
      <mesh castShadow>
        <boxGeometry args={[3.5, 2.4, 0.12]} />
        <meshStandardMaterial color="#39362f" />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[3.28, 2.18]} />
        <meshStandardMaterial color={item.color} roughness={1} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[-1.25 + i * 0.39, Math.sin(i * 1.8) * 0.25, 0.09]}
          rotation={[0, 0, (i - 3) * 0.06]}
        >
          <planeGeometry args={[0.025, 1.45 - i * 0.08]} />
          <meshStandardMaterial color="#c8c3ae" />
        </mesh>
      ))}
      {textVisible && (
        <Html
          transform
          position={[0.8, -1.65, 0.1]}
          distanceFactor={2.4}
          center
          occlude
        >
          <button
            onClick={() => onSelect(item)}
            style={{
              background: "#eee9de",
              border: 0,
              padding: "14px 18px",
              width: 240,
              textAlign: "left",
              color: "#292823",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            <small
              style={{ fontFamily: "Arial", fontSize: 9, letterSpacing: 2 }}
            >
              STUDY OBJECT {item.number}
            </small>
            <strong style={{ display: "block", fontSize: 19, marginTop: 7 }}>
              {item.title}
            </strong>
            <span style={{ display: "block", fontSize: 11, marginTop: 8 }}>
              Read the placard ↗
            </span>
          </button>
        </Html>
      )}
    </group>
  );
}
function SchoolDesk({ onSelect, textVisible }) {
  const { scene } = useGLTF("/models/school-desk/school-desk.glb");
  const model = useMemo(() => {
    const copy = scene.clone(true);
    const bounds = new Box3().setFromObject(copy);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 0.95 / size.y;
    copy.scale.multiplyScalar(scale);
    copy.position.set(
      -center.x * scale,
      -bounds.min.y * scale,
      -center.z * scale,
    );
    copy.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);

  return (
    <group position={[-2, 0, -5]}>
      <group rotation={[0, Math.PI / 5, 0]}>
        <primitive object={model} />
      </group>
      <ContactShadows
        position={[0, 0.008, 0]}
        scale={4}
        opacity={0.45}
        blur={2}
        far={2}
        resolution={256}
        frames={1}
      />
      <spotLight
        position={[1, 4.5, 1]}
        intensity={35}
        angle={0.45}
        penumbra={0.7}
        castShadow
        target={model}
      />
      {textVisible && (
        <Html
          position={[1, 0.85, 0.5]}
          transform
          rotation={[0, 0, 0]}
          distanceFactor={2}
          center
          occlude
        >
          <button
            className={styles.objectPlacard}
            onClick={() => onSelect(classroomDesk)}
          >
            <small>CLASSROOM / 01.3</small>
            <strong>School desk and chair</strong>
            <span>Read the object label ↗</span>
          </button>
        </Html>
      )}
    </group>
  );
}

function FloorMaterial({ room }) {
  const parquet = room.id === 2;
  const concrete = room.id === 3;
  const base = concrete
    ? "/materials/concrete/Concrete033_1K-JPG"
    : parquet
      ? "/materials/parquet/WoodFloor043_1K-JPG"
      : "/materials/marble/Marble012_1K-JPG";
  const loaded = useTexture([
    `${base}_Color.jpg`,
    `${base}_NormalGL.jpg`,
    `${base}_Roughness.jpg`,
  ]);
  const maps = useMemo(
    () =>
      loaded.map((texture, index) => {
        const copy = texture.clone();
        copy.wrapS = copy.wrapT = RepeatWrapping;
        copy.repeat.set(room.width / 3, 4);
        if (index === 0) copy.colorSpace = SRGBColorSpace;
        copy.anisotropy = 8;
        copy.needsUpdate = true;
        return copy;
      }),
    [loaded, room.width],
  );
  useEffect(() => () => maps.forEach((map) => map.dispose()), [maps]);
  return (
    <meshStandardMaterial
      map={maps[0]}
      normalMap={maps[1]}
      roughnessMap={maps[2]}
      normalScale={[0.45, 0.45]}
      roughness={concrete ? 1 : parquet ? 0.85 : 0.7}
    />
  );
}

function Architecture({ room, last, textVisible }) {
  const plaster = useMemo(() => surfaceTexture(8), []);
  const stone = useMemo(() => surfaceTexture(3), []);
  useEffect(
    () => () => {
      plaster.dispose();
      stone.dispose();
    },
    [plaster, stone],
  );
  const middle = (room.front + room.back) / 2;
  const half = room.width / 2;
  const segment = (room.width - 2.4) / 2;
  const walls = [
    [
      [-half, room.height / 2, middle],
      [0.25, room.height, 12],
    ],
    [
      [half, room.height / 2, middle],
      [0.25, room.height, 12],
    ],
    ...(last
      ? [
          [
            [0, room.height / 2, room.back],
            [room.width, room.height, 0.25],
          ],
        ]
      : [
          [
            [-(1.2 + segment / 2), room.height / 2, room.back],
            [segment, room.height, 0.25],
          ],
          [
            [1.2 + segment / 2, room.height / 2, room.back],
            [segment, room.height, 0.25],
          ],
          [
            [0, (room.height + 2.8) / 2, room.back],
            [2.4, room.height - 2.8, 0.25],
          ],
        ]),
  ];
  return (
    <group>
      {walls.map(([position, size], i) => (
        <mesh key={i} position={position} receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={room.id === 0 ? "#e7e2d8" : room.wall}
            roughness={0.9}
            bumpMap={plaster}
            bumpScale={0.018}
          />
        </mesh>
      ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, middle]}
        receiveShadow
      >
        <planeGeometry args={[room.width, 12]} />
        {[0, 2, 3].includes(room.id) ? (
          <Suspense
            fallback={<meshStandardMaterial color="#c2bbaa" roughness={0.6} />}
          >
            <FloorMaterial room={room} />
          </Suspense>
        ) : (
          <meshStandardMaterial
            color={room.id === 4 ? "#9f8971" : "#c2bbaa"}
            roughness={0.48}
            bumpMap={stone}
            bumpScale={0.012}
          />
        )}
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, room.height, middle]}>
        <planeGeometry args={[room.width, 12]} />
        <meshStandardMaterial color={room.wall} />
      </mesh>
      <pointLight
        position={[0, room.height - 1, middle]}
        intensity={room.id === 0 ? 12 : 35}
        distance={14}
        color={room.id === 4 ? "#ffe0af" : "#fff5e5"}
      />
      <mesh position={[0, room.height - 0.08, middle]}>
        <boxGeometry args={[2.5, 0.06, 4]} />
        <meshStandardMaterial
          color="#fff8e8"
          emissive="#fff8e8"
          emissiveIntensity={1}
        />
      </mesh>
      {room.id === 0 && (
        <>
          <rectAreaLight
            position={[0, 5.7, middle]}
            rotation={[-Math.PI / 2, 0, 0]}
            width={2.5}
            height={4}
            intensity={5}
            color="#f5f6ff"
          />
          <directionalLight
            position={[-1, 5.6, -2]}
            intensity={1.5}
            color="#fff5e4"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-normalBias={0.025}
            shadow-radius={4}
          />
          {[-1.35, 1.35].map((x) => (
            <mesh key={x} position={[x, 5.84, middle]}>
              <boxGeometry args={[0.12, 0.25, 4.3]} />
              <meshStandardMaterial color="#d2ccbf" />
            </mesh>
          ))}
          {[-2.1, 2.1].map((z) => (
            <mesh key={z} position={[0, 5.84, middle + z]}>
              <boxGeometry args={[2.8, 0.25, 0.12]} />
              <meshStandardMaterial color="#d2ccbf" />
            </mesh>
          ))}
          {[-half + 0.16, half - 0.16].map((x) => (
            <mesh key={x} position={[x, 0.12, middle]} receiveShadow>
              <boxGeometry args={[0.07, 0.24, 12]} />
              <meshStandardMaterial color="#bdb6a7" roughness={0.65} />
            </mesh>
          ))}
          {[-1.25, 1.25].map((x) => (
            <mesh key={x} position={[x, 1.4, room.back + 0.08]}>
              <boxGeometry args={[0.13, 2.8, 0.65]} />
              <meshStandardMaterial color="#b6b0a2" roughness={0.75} />
            </mesh>
          ))}
          <mesh position={[0, 2.83, room.back + 0.08]}>
            <boxGeometry args={[2.63, 0.12, 0.65]} />
            <meshStandardMaterial color="#b6b0a2" />
          </mesh>
          {Array.from({ length: 7 }, (_, i) => (
            <mesh
              key={`x${i}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[-6 + i * 2, 0.003, middle]}
            >
              <planeGeometry args={[0.012, 12]} />
              <meshStandardMaterial color="#a69e8e" />
            </mesh>
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <mesh
              key={`z${i}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.004, room.front - i * 2]}
            >
              <planeGeometry args={[12, 0.012]} />
              <meshStandardMaterial color="#a69e8e" />
            </mesh>
          ))}
        </>
      )}
      {textVisible && (
        <Html
          transform
          position={[0, room.height - 1.2, room.back + 0.16]}
          distanceFactor={4}
          center
          occlude
        >
          <div className={styles.wallTitle}>
            <small>ROOM {room.number}</small>
            <h2>{room.title}</h2>
            <p>
              {last
                ? "End of the collection · return at your own pace"
                : "Continue through the doorway →"}
            </p>
          </div>
        </Html>
      )}
      {room.id === 0 && (
        <mesh position={[0, room.height / 2, room.front]}>
          <boxGeometry args={[room.width, room.height, 0.25]} />
          <meshStandardMaterial color={room.wall} />
        </mesh>
      )}
    </group>
  );
}
export default function Room({
  active,
  entered,
  movementRef,
  onSelect,
  onRoomChange,
}) {
  const [visibleRooms, setVisibleRooms] = useState([0]);
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.65, 0], fov: 65 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#c5bfb0"]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#fff3da", "#777264", 0.65]} />
      {rooms.map((room, index) => (
        <Architecture
          key={room.id}
          room={room}
          textVisible={entered && visibleRooms.includes(room.id)}
          last={index === rooms.length - 1}
        />
      ))}
      {exhibits.map((item) => (
        <Exhibit
          key={item.number}
          item={item}
          onSelect={onSelect}
          textVisible={entered && visibleRooms.includes(item.roomId)}
        />
      ))}
      <Suspense fallback={null}>
        <SchoolDesk
          onSelect={onSelect}
          textVisible={entered && visibleRooms.includes(0)}
        />
      </Suspense>
      <Navigator
        movementRef={movementRef}
        active={active}
        onRoomChange={onRoomChange}
        onVisibleRoomsChange={setVisibleRooms}
      />
    </Canvas>
  );
}
