import { floodFill, toDict } from "../../../common";
import { knotHash } from "../knotHash.js";

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // prettier-ignore

function getSquares(input) {
  const squares = {};
  for (let y = 0; y < 128; y++) {
    const s = `${input}-${y}`;
    const h = knotHash(s);
    const b = h
      .split("")
      .map((d) => parseInt(d, 16).toString(2).padStart(4, "0").split(""))
      .flat()
      .map((d) => (d === "0" ? "." : "#"));
    for (let x = 0; x < b.length; x++) {
      if (b[x] === "#") {
        squares[`${x},${y}`] = { x, y };
      }
    }
  }
  return squares;
}

function calc1(squares) {
  return Object.keys(squares).length;
}

const toHash = (n) => `${n.x},${n.y}`;

function calcGroups(squares) {
  const backwardNeighbors = (n) =>
    DIRS.map(([dx, dy]) => ({ x: n.x + dx, y: n.y + dy })).filter((d) => toHash(d) in squares); // prettier-ignore
  const gs2 = toDict(Object.keys(squares), (d) => d, () => false); // prettier-ignore
  let n = 0;
  const nextUnexplored = () => Object.keys(gs2).find((d) => gs2[d] === false) ?? false;
  let t = nextUnexplored();
  while (t) {
    if (!t) break;
    const cs2 = floodFill(squares[t], backwardNeighbors, toHash);
    cs2.forEach((p) => (gs2[toHash(p)] = true));
    n++;
    t = nextUnexplored();
  }
  return n;
}

function calc2(squares) {
  return calcGroups(squares);
}

export default function (inputRows) {
  const squares = getSquares(inputRows[0]);
  return [calc1(squares), calc2(squares)];
}
