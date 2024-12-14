import { newMatrix, parseTable } from "../../../common";

const { max, min } = Math;

const toHash = (n) => `${n.x},${n.y}`;

function readInput(input) {
  const clay = {};
  for (let i = 0; i < input.length; i++) {
    const [a1, v1, , v20, v21] = input[i];
    for (let j = v20; j <= v21; j++) {
      const n = { x: a1 === "x" ? v1 : j, y: a1 === "y" ? v1 : j };
      clay[toHash(n)] = n;
    }
  }
  return clay;
}

function plotImage(dicts, bounds) {
  const { xmin, xmax, ymin, ymax } = bounds;
  const m = newMatrix(ymax - ymin + 1, xmax - xmin + 1, () => ".");
  for (const [dict, char, filter] of dicts) {
    let vs = Object.values(dict);
    if (filter) {
      vs = vs.filter(filter);
    }
    vs.forEach(({ x, y }) => (m[y - ymin][x - xmin] = char));
  }
  console.log(m.map((d) => d.join("")).join("\n")); // eslint-disable-line no-console
}

// eslint-disable-next-line no-unused-vars
function plot(water, clay, bounds) {
  plotImage([[water, "|", (d) => d.state === "flowing"], [water, "~", (d) => d.state !== "flowing"], [clay, "#"]], {...bounds, ymin: 0 }); // prettier-ignore
  console.log(); // eslint-disable-line no-console
}

function simulateWater(clay, bounds) {
  const useExplorePath = true;
  const { xmin, xmax, ymax } = bounds;
  const start = { x: 500, y: 0 };
  let filled = false;
  const explorePath = [];
  let exploreState = "down";
  const w = { ...start, state: null };

  const yMinMat = 0;
  const mat = newMatrix(ymax - yMinMat + 1, xmax - xmin + 1, () => ".");
  const getMat = (x, y) => mat[y - yMinMat][x - xmin];
  const setMat = (x, y, v) => {
    mat[y - yMinMat][x - xmin] = v;
  };
  Object.values(clay).forEach(({ x, y }) => {
    setMat(x, y, "#");
  });
  const isClay = (x, y) => getMat(x, y) === "#";
  const isWater = (x, y) => {
    const c = getMat(x, y);
    return c === "~" || c === "|";
  };
  const isFlowingWater = (x, y) => getMat(x, y) === "|";
  const isSettledWater = (x, y) => getMat(x, y) === "~";
  const setWater = (x, y, state) => {
    setMat(x, y, state === "settled" ? "~" : "|");
  };
  const propagateFlowing = ({ x, y }, dx) => {
    let i = x + dx;
    while (isSettledWater(i, y)) {
      setWater(i, y, "flowing");
      i += dx;
    }
  };
  while (!filled) {
    while (w.state === null) {
      const { x, y } = w;
      if (exploreState === "down") {
        if (w.y === ymax) {
          setWater(w.x, w.y, "flowing");
          explorePath.pop();
          break;
        }
        if (!isClay(x, y + 1) && !isWater(x, y + 1)) {
          w.y++;
          explorePath.push({ x: w.x, y: w.y, state: exploreState });
          continue;
        }
        if (isFlowingWater(x, y + 1)) {
          setWater(w.x, w.y, "flowing");
          explorePath.pop();
          break;
        }
        exploreState = isClay(x - 1, y) || isWater(x - 1, y) ? "right" : "left";
      } else {
        if (!isClay(x, y + 1) && !isWater(x, y + 1)) {
          exploreState = "down";
          w.y++;
          explorePath.push({ x: w.x, y: w.y, state: exploreState });
          continue;
        }
        if (isFlowingWater(x, y + 1)) {
          setWater(w.x, w.y, "flowing");
          explorePath.pop();
          break;
        }
        const dx = exploreState === "left" ? -1 : 1;
        if (isWater(x + dx, y)) {
          w.state = "settled";
          if (isFlowingWater(x - dx, y)) {
            w.state = "flowing";
            propagateFlowing({ x, y }, dx);
          }
          if (isFlowingWater(x + dx, y)) {
            w.state = "flowing";
            propagateFlowing({ x, y }, -dx);
          }
          setWater(w.x, w.y, w.state);
          explorePath.pop();
          break;
        }
        if (isClay(x + dx, y)) {
          setWater(w.x, w.y, "settled");
          explorePath.pop();
          break;
        }
        w.x += dx;
        explorePath.push({ x: w.x, y: w.y, state: exploreState });
      }
    }
    if (explorePath.length === 0) {
      filled = true;
      break;
    }
    const p = explorePath.at(-1);
    if (useExplorePath) {
      exploreState = p.state;
      w.x = p.x;
      w.y = p.y;
    } else {
      w.x = start.x;
      w.y = start.y;
      exploreState = "down";
    }
    w.state = null;
    // let a = 1;
  }
  return mat;
}

function calc(input) {
  const clay = readInput(input);
  const cs = Object.values(clay);
  const xs = cs.map((d) => d.x);
  const ys = cs.map((d) => d.y);
  const bounds = {
    xmin: min(...xs) - 2,
    xmax: max(...xs) + 2,
    ymin: min(...ys),
    ymax: max(...ys),
  };
  const water = simulateWater(clay, bounds);
  // plot(water, clay, bounds);
  let ws = 0;
  let wf = 0;
  for (let y = bounds.ymin; y < water.length; y++) {
    for (let x = 0; x < water[0].length; x++) {
      const c = water[y][x];
      if (c === "|") {
        wf++;
      }
      if (c === "~") {
        ws++;
      }
    }
  }
  return [ws + wf, ws];
}

export default function (inputRows) {
  const input = parseTable(inputRows.map((d) => d.replace("..", ",")));
  return calc(input);
}
