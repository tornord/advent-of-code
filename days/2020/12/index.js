const { abs } = Math;

const DIRS = "ESWN".split("").map((d, i) => ({ id: d, x: i % 2 === 0 ? 1 - i : 0, y: i % 2 === 1 ? i - 2 : 0 }));

function calc1(input) {
  const p = { x: 0, y: 0 };
  let dir = DIRS[0];
  for (const [c, n] of input) {
    let dr = dir;
    if (c === "L" || c === "R") {
      let i = (n / 90) % 4;
      if (c === "L") {
        i = 4 - i;
      }
      dir = DIRS[(DIRS.indexOf(dir) + i) % 4];
      continue;
    } else if (c !== "F") {
      dr = DIRS.find((d) => d.id === c);
    }
    p.x += dr.x * n;
    p.y += dr.y * n;
  }
  return abs(p.x) + abs(p.y);
}

function calc2(input) {
  const p = { x: 0, y: 0 };
  let waypoint = { x: 10, y: 1 };
  for (const [c, n] of input) {
    let dr = waypoint;
    if (c === "L" || c === "R") {
      let i = (n / 90) % 4;
      if (c === "L") {
        i = 4 - i;
      }
      dr = DIRS[i];
      waypoint = { x: dr.x * waypoint.x - dr.y * waypoint.y, y: dr.y * waypoint.x + dr.x * waypoint.y };
      continue;
    } else if (c !== "F") {
      dr = DIRS.find((d) => d.id === c);
      waypoint.x += dr.x * n;
      waypoint.y += dr.y * n;
      continue;
    }
    p.x += dr.x * n;
    p.y += dr.y * n;
  }
  return abs(p.x) + abs(p.y);
}

export default function (inputRows) {
  const input = inputRows.map((r) => [r.slice(0, 1), Number(r.slice(1))]);
  return [calc1(input), calc2(input)];
}
