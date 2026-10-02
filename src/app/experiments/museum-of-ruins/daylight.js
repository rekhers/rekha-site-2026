import { Color, MathUtils } from "three";

// An atmospheric local-clock cycle, not a location-based sun calculation.
const stages = [
  {
    hour: 0,
    color: "#809acb",
    sky: "#354969",
    power: 0.16,
    length: 3,
    lean: 0,
  },
  {
    hour: 5,
    color: "#809acb",
    sky: "#354969",
    power: 0.16,
    length: 3,
    lean: 0,
  },
  {
    hour: 8,
    color: "#ffe0ab",
    sky: "#fff0d6",
    power: 0.8,
    length: 5,
    lean: -0.18,
  },
  { hour: 13, color: "#fff6e7", sky: "#fffdf3", power: 1, length: 3, lean: 0 },
  {
    hour: 17,
    color: "#ffd29a",
    sky: "#ffe3ba",
    power: 0.8,
    length: 5,
    lean: 0.18,
  },
  {
    hour: 19,
    color: "#f2ad79",
    sky: "#e6b08c",
    power: 0.5,
    length: 6,
    lean: 0.22,
  },
  {
    hour: 21,
    color: "#809acb",
    sky: "#354969",
    power: 0.16,
    length: 3,
    lean: 0,
  },
  {
    hour: 24,
    color: "#809acb",
    sky: "#354969",
    power: 0.16,
    length: 3,
    lean: 0,
  },
];

export function entranceDaylight(date = new Date()) {
  const hour =
    date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const index = stages.findIndex((stage) => stage.hour > hour);
  const a = stages[index - 1];
  const b = stages[index];
  const t = MathUtils.smoothstep(hour, a.hour, b.hour);
  return {
    color: new Color(a.color).lerp(new Color(b.color), t),
    sky: new Color(a.sky).lerp(new Color(b.sky), t),
    power: MathUtils.lerp(a.power, b.power, t),
    length: MathUtils.lerp(a.length, b.length, t),
    lean: MathUtils.lerp(a.lean, b.lean, t),
  };
}
