"use client";
import Image from "next/image";
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

import {
  rooms,
  canWalk,
  deskCluster,
  passages,
  inRoom,
  nearEntrance,
  roomWalls,
  entrance,
  exitHall,
} from "./exhibits";
import { surfaceTexture } from "./materials";
import { statementParagraphs } from "./statement";
import WallText from "./wall-text";
import Monument from "./monument";
import { entranceDaylight } from "./daylight";
import styles from "./museum.module.css";

function Navigator({
  poseRef,
  travelRef,
  entered,
  active,
  movementRef,
  onRoomChange,
  destination,
  onVisibleRoomsChange,
  onExit,
}) {
  const lastDestination = useRef(null);
  const keys = useRef(new Set());
  const currentRoom = useRef(-1);
  const visibilityKey = useRef("");

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
    if (!entered) {
      camera.position.set(entrance.x, 1.65, 3);
      camera.rotation.set(0, 0, 0, "YXZ");
      yaw.current = 0;
      pitch.current = 0;
      return;
    }
    if (!active) return;
    if (destination && destination !== lastDestination.current) {
      lastDestination.current = destination;
      const { item } = destination;
      const room = rooms[item.roomId];
      let target = item.position || [-2.6, 1, -5];
      if (item.number === "02.1") target = [room.x - 5.32, 2.6, (room.front + room.doors.left + 1.2) / 2];
      // The classroom's original study objects have been replaced by posters.
      if (item.number === "01.1") target = [-5.84, 2.5, -4];
      if (item.number === "01.2") target = [5.84, 2.5, -1.5];
      const x = room.x;
      const z = target[2];
      camera.position.set(x, 1.65, z);
      yaw.current = Math.atan2(x - target[0], z - target[2]);
      pitch.current = 0;
      keys.current.clear();
      drag.current = null;
    }
    if (travelRef.current) {
      const { x, z } = travelRef.current;
      travelRef.current = null;
      if (canWalk(x, z)) camera.position.set(x, 1.65, z);
      keys.current.clear();
      movementRef.current = { x: 0, y: 0 };
      drag.current = null;
    }
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
    const roomIndex = rooms.findIndex((room) =>
      inRoom(room, camera.position.x, camera.position.z),
    );
    const visible = rooms
      .filter(
        (room) =>
          inRoom(room, camera.position.x, camera.position.z) ||
          nearEntrance(room, camera.position.x, camera.position.z),
      )
      .map((room) => room.id);
    const key = visible.join(",");
    if (key !== visibilityKey.current) {
      visibilityKey.current = key;
      onVisibleRoomsChange(visible);
    }
    if (roomIndex !== currentRoom.current) {
      currentRoom.current = roomIndex;
      onRoomChange(roomIndex);
    }
    if (canWalk(camera.position.x + dx, camera.position.z))
      camera.position.x += dx;
    if (canWalk(camera.position.x, camera.position.z + dz))
      camera.position.z += dz;
    poseRef.current = { x: camera.position.x, z: camera.position.z, yaw: yaw.current };
    if (
      Math.abs(camera.position.x - entrance.x) < 0.75 &&
      camera.position.z >= entrance.front - 0.08
    )
      onExit();
  });
  return null;
}
function ClassroomPosters({ visible }) {
  if (!visible) return null;
  const posters = [
    {
      title: "READ — Shaquille O’Neal for America’s Libraries",
      image: "https://melmagazine.com/uploads/2020/07/read_shaq_poster-1.jpg",
      source: "https://melmagazine.com/en-us/story/shaq-reading-meme",
      credit: "American Library Association · image via MEL",
      position: [-5.84, 2.5, -7.5],
      rotation: [0, Math.PI / 2, 0],
      width: 345,
      height: 460,
    },

    {
      title: "All Are Welcome",
      image:
        "https://cdn11.bigcommerce.com/s-swdvv2w64y/product_images/uploaded_images/ait-allarewelcome.png",
      source:
        "https://www.carsondellosa.com/blogs-articles/spread-the-love-inclusivity-in-the-classroom/",
      credit: "Carson Dellosa Education",
      position: [-5.84, 2.5, -4],
      rotation: [0, Math.PI / 2, 0],
      width: 350,
      height: 460,
    },
    {
      title: "Well Behaved Women Rarely Make History",
      image:
        "https://ih1.redbubble.net/image.2362731660.9738/flat%2C750x%2C075%2Cf-pad%2C750x1000%2Cf8f8f8.jpg",
      source:
        "https://www.redbubble.com/i/poster/Vintage-Girl-Well-Behaved-Women-Rarely-Make-History-Poster-by-ArminaNLabrie/78069738/flk2",
      credit: "ArminaNLabrie / Redbubble",
      position: [5.84, 2.5, -1.5],
      rotation: [0, -Math.PI / 2, 0],
      width: 345,
      height: 460,
    },
  ];
  return posters.map((poster) => (
    <Html
      key={poster.title}
      transform
      position={poster.position}
      rotation={poster.rotation}
      distanceFactor={2.1}
      center
      occlude
    >
      <a
        className={styles.classroomPoster}
        href={poster.source}
        target="_blank"
        rel="noreferrer"
        style={{ width: poster.width }}
        aria-label={`${poster.title} — source: ${poster.credit}`}
      >
        <Image
          unoptimized
          src={poster.image}
          alt={poster.title}
          width={poster.width}
          height={poster.height}
          style={{ width: "100%", height: poster.height, objectFit: "contain" }}
        />
        <small>{poster.credit}</small>
      </a>
    </Html>
  ));
}

function SchoolDesk() {
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

  const desks = useMemo(
    () => deskCluster.map(() => model.clone(true)),
    [model],
  );

  return (
    <group>
      {deskCluster.map((desk, index) => (
        <group
          key={index}
          position={desk.position}
          rotation={[0, desk.rotation, 0]}
        >
          <primitive object={desks[index]} />
        </group>
      ))}
      <ContactShadows
        position={[-2.6, 0.008, -5]}
        scale={5}
        opacity={0.45}
        blur={2}
        far={2}
        resolution={256}
        frames={1}
      />
      <pointLight
        position={[-2.6, 4, -5]}
        intensity={25}
        distance={8}
        color="#fff3dd"
      />
    </group>
  );
}

function HearingScreen({ visible }) {
  const [playing, setPlaying] = useState(false);
  return (
    <group
      position={[rooms[1].x - 5.32, 2.6, (rooms[1].front + rooms[1].doors.left + 1.2) / 2]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <mesh>
        <boxGeometry args={[4.4, 2.6, 0.18]} />
        <meshStandardMaterial color="#080808" roughness={0.4} />
      </mesh>
      <Html
        transform
        position={[0, 0, 0.11]}
        distanceFactor={2.65}
        center
        occlude
      >
        <div className={styles.television}>
          {playing && visible ? (
            <iframe
              title="C-SPAN: Ford and Kavanaugh Senate hearing, September 27, 2018"
              src="https://www.youtube-nocookie.com/embed/7zVOkb3CdZ0?autoplay=1&playsinline=1"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <button
              className={styles.hearingPoster}
              onClick={() => setPlaying(true)}
              aria-label="Play hearing footage: Brett Kavanaugh testifying"
            >
              <small>SEPTEMBER 27, 2018 · C-SPAN</small>
              <strong>The hearing</strong>
              <span>▶ Play hearing footage</span>
            </button>
          )}
        </div>
        {visible && (
          <div className={styles.screenCredit}>
            <a
              href="https://www.scarymommy.com/brett-kavanaugh-crying"
              target="_blank"
              rel="noreferrer"
            >
              Photo: Win McNamee / Getty Images
            </a>
            <a
              href="https://www.washingtonpost.com/video/politics/kavanaugh-we-drank-beer/2018/09/27/5cd36f5c-c293-11e8-9451-e878f96be19b_video.html"
              target="_blank"
              rel="noreferrer"
            >
              Watch the “We drank beer” excerpt ↗
            </a>
            {playing && (
              <button onClick={() => setPlaying(false)}>Stop playback</button>
            )}
          </div>
        )}
      </Html>
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
  const walls = roomWalls(room);
  return (
    <group position={[room.x, 0, 0]}>
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
            color={
              room.id === 1 ? "#101114" : room.id === 4 ? "#9f8971" : "#c2bbaa"
            }
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
        intensity={room.id === 1 ? 5 : room.id === 0 ? 12 : 35}
        distance={14}
        color={room.id === 4 ? "#ffe0af" : "#fff5e5"}
      />
      <mesh position={[0, room.height - 0.08, middle]}>
        <boxGeometry args={[2.5, 0.06, 4]} />
        <meshStandardMaterial
          color="#fff8e8"
          emissive="#fff8e8"
          emissiveIntensity={room.id === 1 ? 0.1 : 1}
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
          {walls
            .filter(
              ([position, size]) => Math.abs(position[1] - size[1] / 2) < 0.01,
            )
            .map(([position, size], i) => (
              <mesh
                key={`baseboard-${i}`}
                position={[position[0], 0.12, position[2]]}
                receiveShadow
              >
                <boxGeometry
                  args={[
                    size[0] === 0.12 ? 0.2 : size[0],
                    0.24,
                    size[2] === 0.12 ? 0.2 : size[2],
                  ]}
                />
                <meshStandardMaterial color="#bdb6a7" roughness={0.65} />
              </mesh>
            ))}
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
      {room.id === 1 && textVisible && (
        <group position={[room.width / 2 - 0.13, 2.6, -6.7]} rotation={[0, -Math.PI / 2, 0]}>
          <WallText width={3.8} color="#f3efe7" blocks={[
            { text: "Their deaths were preventable.", size: 88, gap: 45 },
            { text: "Amber Nicole Thurman. Candi Miller. Josseli Barnica. Nevaeh Crain. Porsha Ngumezi.", size: 46 },
            { text: "Georgia’s review committee judged Thurman’s and Miller’s deaths preventable. Medical experts reviewing the Texas cases for ProPublica identified failures in care.", size: 38 },
          ]} />
          {[
            ["Amber Nicole Thurman", "georgia-abortion-ban-amber-thurman-death"],
            ["Candi Miller", "candi-miller-abortion-ban-death-georgia"],
            ["Josseli Barnica", "josseli-barnica-death-miscarriage-texas-abortion-ban"],
            ["Nevaeh Crain", "nevaeh-crain-death-texas-abortion-ban-emtala"],
            ["Porsha Ngumezi", "porsha-ngumezi-miscarriage-death-texas-abortion-ban"],
          ].map(([name, slug], index) => (
            <WallText key={name} position={[0, -1.15 - index * 0.17, 0.005]} width={3.8} color="#c8c1b5"
              blocks={[{ text: `[${index + 1}] ${name} · ProPublica ↗`, size: 26, sans: true, gap: 0 }]}
              onClick={(event) => { event.stopPropagation(); window.open(`https://www.propublica.org/article/${slug}`, "_blank", "noopener,noreferrer"); }} />
          ))}
        </group>
      )}
      {room.id === 1 && textVisible && (
        <WallText position={[0, 2.35, room.front - 0.13]} rotation={[0, Math.PI, 0]} width={4.3} color="#f3efe7"
          blocks={[{ text: "the feeling that things are actually worse for us than they were for our mothers...", size: 68 }]} />
      )}
      {textVisible && (
        <WallText position={room.id === 2 ? [room.width / 2 - 0.13, 2.8, room.doors.left] : [0, room.height - 1.2, room.back + 0.13]} rotation={room.id === 2 ? [0, -Math.PI / 2, 0] : [0, 0, 0]} width={room.id === 2 ? 5.2 : 4} color={room.id === 1 ? "#ffffff" : "#302e29"}
          blocks={[
            { text: `ROOM ${room.number}`, size: 24, sans: true },
            { text: room.title, size: room.id === 2 ? 110 : 70, gap: room.id === 2 ? 48 : 28 },
            { text: last ? "End of the collection · return at your own pace" : room.doors.right !== undefined ? "Continue through the doorway on your right →" : "Continue through the doorway →", size: 25, sans: true },
          ]} />
      )}
    </group>
  );
}
function SunlitExit() {
  const [daylight, setDaylight] = useState(() => entranceDaylight());
  useEffect(() => {
    const update = () => setDaylight(entranceDaylight());
    const timer = window.setInterval(update, 30000);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);
  const left = useRef(null);
  const right = useRef(null);
  useFrame(({ camera }, dt) => {
    const near =
      Math.hypot(
        camera.position.x - entrance.x,
        camera.position.z - entrance.front,
      ) < 2.4;
    const angle = near ? Math.PI * 0.44 : 0;
    left.current.rotation.y = MathUtils.damp(
      left.current.rotation.y,
      -angle,
      5,
      dt,
    );
    right.current.rotation.y = MathUtils.damp(
      right.current.rotation.y,
      angle,
      5,
      dt,
    );
  });
  return (
    <group position={[0, 0, entrance.front]}>
      {/* Each leaf is built around a real opening for the narrow glass slit. */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          ref={side === -1 ? left : right}
          position={[side * 1.2, 0, 0]}
        >
          <group position={[-side * 0.6, 0, 0]}>
            {[
              [
                [0, 0.55, 0],
                [1.18, 1.1, 0.09],
              ],
              [
                [0, 2.65, 0],
                [1.18, 0.3, 0.09],
              ],
              [
                [-0.385, 1.8, 0],
                [0.41, 1.4, 0.09],
              ],
              [
                [0.385, 1.8, 0],
                [0.41, 1.4, 0.09],
              ],
            ].map(([position, size], i) => (
              <mesh key={i} position={position} castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial
                  color="#bcb5a6"
                  roughness={0.6}
                  metalness={0.15}
                />
              </mesh>
            ))}
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[0.36, 1.4, 0.025]} />
              <meshBasicMaterial color={daylight.sky} toneMapped={false} />
            </mesh>
            <mesh position={[-side * 0.35, 1.02, -0.09]}>
              <boxGeometry args={[0.3, 0.035, 0.07]} />
              <meshStandardMaterial
                color="#706b61"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
          </group>
        </group>
      ))}
      <mesh position={[0, 1.4, 0.45]}>
        <boxGeometry args={[2.6, 2.9, 0.03]} />
        <meshBasicMaterial color={daylight.sky} toneMapped={false} />
      </mesh>
      <rectAreaLight
        position={[0, 1.8, -0.15]}
        width={2.2}
        height={2.6}
        intensity={7 * daylight.power}
        color={daylight.color}
      />
      {[-0.6, 0.6].map((x) => (
        <group key={x}>
          <spotLight
            position={[x, 2.4, -0.15]}
            target-position={[x - 1, 0, -4]}
            angle={0.25}
            penumbra={0.8}
            intensity={22 * daylight.power}
            color={daylight.color}
          />
          <mesh
            position={[x, 0.012, -daylight.length / 2]}
            rotation={[-Math.PI / 2, 0, daylight.lean]}
          >
            <planeGeometry args={[0.4, daylight.length]} />
            <meshBasicMaterial
              color={daylight.color}
              transparent
              opacity={0.3 * daylight.power}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      <WallText position={[0, 3.05, -0.15]} rotation={[0, Math.PI, 0]} width={2}
        blocks={[{ text: "EXIT · RETURN TO PORTFOLIO", size: 52, sans: true, gap: 0 }]} />
    </group>
  );
}

function Entrance() {
  return (
    <group position={[entrance.x, 0, 0]}>
      <SunlitExit />
      {roomWalls(entrance).map(([position, size], i) => (
        <mesh key={i} position={position}>
          <boxGeometry args={size} />
          <meshStandardMaterial color={entrance.wall} roughness={0.9} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial color="#b8b09f" roughness={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 3]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial color={entrance.wall} />
      </mesh>
      <rectAreaLight
        position={[0, 3.55, entrance.back + 1.2]}
        rotation={[-0.45, 0, 0]}
        width={3.8}
        height={0.6}
        intensity={5}
        color="#fff5e5"
      />
      <WallText position={[0, 2.05, entrance.back + 0.13]} width={3.55}
        blocks={[
          { text: "AN EXPLORATION OF LOSS", size: 22, sans: true },
          { text: "Museum of Ruins", size: 85, gap: 40 },
          ...statementParagraphs.map((text) => ({ text, size: 40, gap: 35 })),
          { text: "REKHA TENJARLA", size: 24, sans: true },
        ]} />
    </group>
  );
}

function ExitHall() {
  return (
    <group position={[exitHall.x, 0, 0]}>
      {roomWalls(exitHall).map(([position, size], i) => (
        <mesh key={i} position={position}>
          <boxGeometry args={size} />
          <meshStandardMaterial color={exitHall.wall} roughness={0.9} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -18]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#8f8a7f" roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.1, -18]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={exitHall.wall} />
      </mesh>
      <pointLight
        position={[0, 2.6, -18]}
        intensity={16}
        distance={9}
        color="#fff1d9"
      />
      <mesh position={[0, 3.04, -18]}>
        <boxGeometry args={[4, 0.05, 0.2]} />
        <meshStandardMaterial
          color="#fff1d9"
          emissive="#fff1d9"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function Passage({ passage: p }) {
  const plaster = useMemo(() => surfaceTexture(8), []);
  useEffect(() => () => plaster.dispose(), [plaster]);
  const height = 3.1;
  const middle = (p.front + p.back) / 2;
  const wallSegments = [];
  for (const [z, opening] of [
    [p.front, p.from.x],
    [p.back, p.to.x],
  ]) {
    for (const [left, right] of [
      [p.left, opening - 1.2],
      [opening + 1.2, p.right],
    ]) {
      if (right - left > 0.01)
        wallSegments.push([
          [(left + right) / 2, height / 2, z],
          [right - left, height, 0.2],
        ]);
    }
    wallSegments.push([
      [opening, 2.95, z],
      [2.4, 0.3, 0.2],
    ]);
  }
  wallSegments.push(
    [
      [p.left, height / 2, middle],
      [0.2, height, 4],
    ],
    [
      [p.right, height / 2, middle],
      [0.2, height, 4],
    ],
  );
  return (
    <group>
      {wallSegments.map(([position, size], i) => (
        <mesh key={i} position={position}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={p.to.wall}
            roughness={0.9}
            bumpMap={plaster}
            bumpScale={0.018}
          />
        </mesh>
      ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[(p.left + p.right) / 2, 0, middle]}
      >
        <planeGeometry args={[p.right - p.left, 4]} />
        <meshStandardMaterial color="#8f8a7f" roughness={0.9} />
      </mesh>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[(p.left + p.right) / 2, height, middle]}
      >
        <planeGeometry args={[p.right - p.left, 4]} />
        <meshStandardMaterial color={p.to.wall} roughness={0.9} />
      </mesh>
      <pointLight
        position={[(p.left + p.right) / 2, 2.6, middle]}
        intensity={16}
        distance={9}
        color="#fff1d9"
      />
      <mesh position={[(p.left + p.right) / 2, 3.04, middle]}>
        <boxGeometry args={[2, 0.05, 0.2]} />
        <meshStandardMaterial
          emissive="#fff1d9"
          emissiveIntensity={1}
          color="#fff1d9"
        />
      </mesh>
    </group>
  );
}

export default function Room({
  poseRef,
  travelRef,
  active,
  entered,
  movementRef,
  destination,
  onRoomChange,
  onExit,
}) {
  const [visibleRooms, setVisibleRooms] = useState([]);
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [entrance.x, 1.65, 3], rotation: [0, 0, 0], fov: 65 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#c5bfb0"]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#fff3da", "#777264", 0.65]} />
      <Entrance />
      <ExitHall />
      <Monument />
      {passages.map((passage, index) => (
        <Passage key={index} passage={passage} />
      ))}
      {rooms.map((room, index) => (
        <Architecture
          key={room.id}
          room={room}
          textVisible={entered && visibleRooms.includes(room.id)}
          last={index === rooms.length - 1}
        />
      ))}
      <ClassroomPosters visible={entered && visibleRooms.includes(0)} />
      <Suspense fallback={null}>
        <SchoolDesk />
      </Suspense>
      {entered && visibleRooms.includes(1) && (
        <HearingScreen visible={active} />
      )}
      <Navigator
        poseRef={poseRef}
        travelRef={travelRef}
        entered={entered}
        destination={destination}
        movementRef={movementRef}
        active={active}
        onRoomChange={onRoomChange}
        onExit={onExit}
        onVisibleRoomsChange={setVisibleRooms}
      />
    </Canvas>
  );
}
