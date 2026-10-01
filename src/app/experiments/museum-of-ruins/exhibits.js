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
    wall: "#c9bfb4",
    color: "#795958",
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

export const exhibits = rooms.flatMap((room) =>
  room.objects.map((item, index) => ({
    ...item,
    number: `${room.number}.${index + 1}`,
    roomId: room.id,
    position: [
      index === 0 ? -room.width / 2 + 0.18 : room.width / 2 - 0.18,
      2.5,
      room.front - 5 - index * 2,
    ],
    rotation: [0, index === 0 ? Math.PI / 2 : -Math.PI / 2, 0],
    color: room.color,
  })),
);

export function canWalk(x, z) {
  if (Math.abs(x + 2) < 1.05 && Math.abs(z + 5) < 1.1) return false;
  if (z > rooms[0].front - 0.5 || z < rooms.at(-1).back + 0.5) return false;
  for (const room of rooms.slice(0, -1)) {
    if (Math.abs(z - room.back) < 0.5) return Math.abs(x) < 0.75;
  }
  const room = rooms.find((room) => z <= room.front && z >= room.back);
  return Boolean(room && Math.abs(x) < room.width / 2 - 0.5);
}

export const classroomDesk = {
  number: "01.3",
  roomId: 0,
  title: "School desk and chair",
  text: "The first object in the classroom installation: a place to sit, learn, and inhabit an institution. Its interpretation within Assault on Humanities is still in development.",
  credit: true,
};
