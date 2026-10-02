export const rooms = [
  {
    id: 0,
    number: "01",
    title: "Assault on Humanities",
    description:
      "Arts, education, archives, and the conditions of public knowledge.",
    width: 12,
    height: 6.0,
    front: 2,
    back: -10,
    wall: "#ded9cb",
    color: "#626c60",
    objects: [
      {
        title: "The missing shelf",
        text: "A proposed installation of empty shelves: spaces for books, collections, and public knowledge.",
      },
      {
        title: "The dark index",
        text: "A proposed archive interface whose empty entries invite the visitor to ask what is no longer accessible.",
      },
    ],
  },
  {
    id: 1,
    number: "02",
    title: "The Rape Presidency",
    description:
      "Sexual entitlement, disbelief of women, Kavanaugh, and the path toward the loss of abortion rights.",
    width: 11,
    height: 5.65,
    front: -10,
    back: -22,
    wall: "#08090b",
    color: "#17191d",
    objects: [
      {
        title: "The hearing",
        text: "A proposed arrangement of testimony surfaces. Historical transcripts and source material will be selected and verified before inclusion.",
      },
      {
        title: "A right, bracketed",
        text: "A proposed timeline for bodily autonomy, legal decisions, and their consequences. Dates and documents remain to be researched.",
      },
    ],
  },
  {
    id: 2,
    number: "03",
    title: "The Queer Archive",
    description:
      "Queer memory, visibility, gender nonconformity, censorship, and renewed political targeting.",
    width: 10,
    height: 5.3,
    front: -22,
    back: -34,
    wall: "#cbc5d3",
    color: "#695f7b",
    objects: [
      {
        title: "An unfinished archive",
        text: "A proposed constellation of preserved fragments, with deliberate space for lives that were never recorded.",
      },
      {
        title: "Visible / withheld",
        text: "A proposed pairing of an illuminated surface and an obscured one: visibility as both possibility and exposure.",
      },
    ],
  },
  {
    id: 3,
    number: "04",
    title: "The Domestic Terror of ICE",
    description:
      "Fear, surveillance, raids, detention, disappearance, and state violence.",
    width: 9,
    height: 4.95,
    front: -34,
    back: -46,
    wall: "#bdc6c3",
    color: "#526761",
    objects: [
      {
        title: "The waiting room",
        text: "A proposed installation about waiting under uncertainty. Testimony will require careful sourcing, consent, and context.",
      },
      {
        title: "A record of absence",
        text: "A proposed wall of gaps in an administrative grid. No names or case histories have been invented for this sketch.",
      },
    ],
  },
  {
    id: 4,
    number: "05",
    title: "The Personal Collection",
    description:
      "Journalism, the Washington Post, a career, an artistic life\u2014and the institutions that helped make one person.",
    width: 8,
    height: 4.6,
    front: -46,
    back: -58,
    wall: "#d5c5b2",
    color: "#927454",
    objects: [
      {
        title: "A working life",
        text: "A place for Rekha\u2019s work, tools, and journalism. Specific objects and personal captions will be selected by the artist.",
      },
      {
        title: "What I carried forward",
        text: "A place for the artistic life that continues beyond an institution. The collection is still being assembled.",
      },
    ],
  },
];

// An entrance corridor, four adjoining galleries, then the personal collection.
const layout = [
  { x: 0, front: 2, back: -10, doors: { left: 0, right: -6 } },
  { x: 11.5, front: 2, back: -10, doors: { left: -6, right: -2 } },
  { x: 22, front: 2, back: -10, doors: { left: -2, back: 0 } },
  { x: 22, front: -10, back: -22, doors: { front: 0, right: -18 } },
  { x: 36.5, front: -12, back: -24, doors: { left: -18 } },
];
export const entrance = {
  x: -9,
  width: 6,
  height: 4,
  front: 10,
  back: -4,
  doors: { right: 0, front: 0 },
  wall: "#e7e2d8",
};
rooms.forEach((room, index) => Object.assign(room, layout[index]));
export const exitHall = {
  x: 29.5,
  width: 6,
  height: 3.1,
  front: -16,
  back: -20,
  doors: { left: -18, right: -18 },
  wall: rooms[4].wall,
};
export const passages = [];
export function inRoom(room, x, z) {
  return (
    Math.abs(x - room.x) < room.width / 2 && z <= room.front && z >= room.back
  );
}
export function nearEntrance(room, x, z) {
  if (room.doors.left !== undefined)
    return (
      Math.abs(x - (room.x - room.width / 2)) < 1.8 &&
      Math.abs(z - room.doors.left) < 1.6
    );
  return z > room.front && z < room.front + 1.8 && Math.abs(x - room.x) < 1.6;
}
export function roomWalls(room) {
  const result = [];
  for (const side of ["left", "right", "front", "back"]) {
    const vertical = side === "left" || side === "right";
    const low = vertical ? room.back : -room.width / 2;
    const high = vertical ? room.front : room.width / 2;
    const fixed =
      side === "left"
        ? -room.width / 2 + 0.06
        : side === "right"
          ? room.width / 2 - 0.06
          : side === "front"
            ? room.front - 0.06
            : room.back + 0.06;
    const door = room.doors[side];
    const sections =
      door === undefined
        ? [[low, high, 0, room.height]]
        : [
            [low, door - 1.2, 0, room.height],
            [door + 1.2, high, 0, room.height],
            [door - 1.2, door + 1.2, 2.8, room.height],
          ];
    for (const [start, end, bottom, top] of sections) {
      const center = (start + end) / 2,
        y = (bottom + top) / 2;
      result.push([
        vertical ? [fixed, y, center] : [center, y, fixed],
        vertical
          ? [0.12, top - bottom, end - start]
          : [end - start, top - bottom, 0.12],
      ]);
    }
  }
  return result;
}

export const exhibits = rooms.flatMap((room) =>
  room.objects.map((item, index) => ({
    ...item,
    number: `${room.number}.${index + 1}`,
    roomId: room.id,
    position: [
      room.x + (index === 0 ? -room.width / 2 + 0.18 : room.width / 2 - 0.18),
      2.5,
      room.front - 2,
    ],
    rotation: [0, index === 0 ? Math.PI / 2 : -Math.PI / 2, 0],
    color: room.color,
  })),
);

export const deskCluster = Array.from({ length: 3 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 3;
  return {
    position: [-2.6 + Math.sin(angle) * 1.05, 0, -5 + Math.cos(angle) * 1.05],
    rotation: angle + Math.PI,
  };
});

export function canWalk(x, z) {
  if (
    deskCluster.some(
      ({ position }) => Math.hypot(x - position[0], z - position[2]) < 0.85,
    )
  )
    return false;
  for (const room of [...rooms, entrance, exitHall]) {
    const localX = x - room.x;
    if (
      Math.abs(localX) < room.width / 2 - 0.4 &&
      z < room.front - 0.4 &&
      z > room.back + 0.4
    )
      return true;
    for (const [side, center] of Object.entries(room.doors)) {
      if (side === "left" || side === "right") {
        const wallX =
          room.x + (side === "left" ? -room.width / 2 : room.width / 2);
        if (Math.abs(x - wallX) < 0.5 && Math.abs(z - center) < 0.75)
          return true;
      } else {
        const wallZ = side === "front" ? room.front : room.back;
        if (Math.abs(z - wallZ) < 0.5 && Math.abs(localX - center) < 0.75)
          return true;
      }
    }
  }
  return passages.some(
    (p) =>
      z < p.front - 0.35 &&
      z > p.back + 0.35 &&
      x > p.left + 0.4 &&
      x < p.right - 0.4,
  );
}

export const classroomDesk = {
  number: "01.3",
  roomId: 0,
  title: "A classroom circle",
  text: "Three school desks gathered into a circle: a place to sit, learn, and inhabit an institution together. Its interpretation within Assault on Humanities is still in development.",
  credit: true,
};
