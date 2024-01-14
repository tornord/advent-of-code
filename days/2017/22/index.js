import { newMatrix } from "../../../common";

const { max, min } = Math;

const toHash = (n) => `${n.x},${n.y}`;

// eslint-disable-next-line no-unused-vars
const plotMap = (mat) => {
  const cs = Object.keys(mat).map((d) => d.split(",").map(Number));
  const minx = min(...cs.map((d) => d[0]));
  const miny = min(...cs.map((d) => d[1]));
  const maxx = max(...cs.map((d) => d[0]));
  const maxy = max(...cs.map((d) => d[1]));
  const m = newMatrix(maxy - miny + 1, maxx - minx + 1, (r, c) => mat[toHash({ x: c + minx, y: r + miny })] ?? ".");
  // eslint-disable-next-line no-console
  console.log(m.map((d) => d.join("")).join("\n"));
};

function doBurst(infecteds, carrier, part = 2) {
  const { x, y, dx, dy } = carrier;
  const key = `${x},${y}`;
  const c = infecteds[key] ?? ".";
  if (c === ".") {
    infecteds[key] = part === 2 ? "W" : "#";
    carrier.dx = dy;
    carrier.dy = -dx;
  } else if (c === "#") {
    if (part === 2) {
      infecteds[key] = "F";
    } else {
      delete infecteds[key];
    }
    carrier.dx = -dy;
    carrier.dy = dx;
  } else if (c === "F") {
    delete infecteds[key];
    carrier.dx = -dx;
    carrier.dy = -dy;
  } else if (c === "W") {
    infecteds[key] = "#";
  }
  carrier.x += carrier.dx;
  carrier.y += carrier.dy;
  return c === (part === 2 ? "W" : ".");
}

function calc(infecteds, carrier, nBursts, part) {
  let n = 0;
  for (let y = 0; y < nBursts; y++) {
    if (doBurst(infecteds, carrier, part)) {
      n++;
    }
  }
  // plotMap(infecteds);
  return n;
}

export default function (inputRows, filename) {
  let nBursts1 = 10_000;
  let nBursts2 = 10_000_000;
  if (filename === "example1.txt") {
    nBursts1 = 70;
    nBursts2 = 100;
  }
  const infecteds = {};
  const carrier = { x: 0, y: 0, dx: 0, dy: -1 };
  const x0 = (inputRows[0].length - 1) / 2;
  const y0 = (inputRows.length - 1) / 2;
  inputRows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      if (r[x] === "#") {
        infecteds[`${x - x0},${y - y0}`] = "#";
      }
    }
  });
  return [calc({ ...infecteds }, { ...carrier }, nBursts1, 1), calc({ ...infecteds }, { ...carrier }, nBursts2, 2)];
}
