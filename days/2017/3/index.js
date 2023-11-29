import { toDict } from "../../../common";

const { abs } = Math;

const MAX_LAYERS = 300;

function calcSquares() {
  const res = [{ x: 0, y: 0, i: 0, s: 1 }];
  for (let i = 1; i <= MAX_LAYERS; i++) {
    const s = 2 * i;
    for (let k = 0; k < s; k++) {
      const x = i;
      const y = i - 1 - k;
      res.push({ x, y, i, s: 0 });
    }
    for (let k = 0; k < s; k++) {
      const x = i - 1 - k;
      const y = -i;
      res.push({ x, y, i, s: 0 });
    }
    for (let k = 0; k < s; k++) {
      const x = -i;
      const y = -(i - 1) + k;
      res.push({ x, y, i, s: 0 });
    }
    for (let k = 0; k < s; k++) {
      const x = -(i - 1) + k;
      const y = i;
      res.push({ x, y, i, s: 0 });
    }
  }
  return res;
}

function calc1(input) {
  const ss = calcSquares();
  if (input - 1 >= ss.length) return 0;
  const { x, y } = ss[input - 1];
  return abs(x) + abs(y);
}

function calc2(input) {
  const ss = calcSquares();
  const dict = toDict(
    ss,
    (d) => `${d.x},${d.y}`,
    (d) => d
  );
  for (let i = 1; i < ss.length; i++) {
    const { x, y } = ss[i];
    let s = 0;
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        if (j === 0 && k === 0) continue;
        const key = `${x + k},${y + j}`;
        s += dict[key]?.s || 0;
      }
    }
    dict[`${x},${y}`].s = s;
    if (s > input) return s;
  }
  return null;
}

export default function (inputRows) {
  const input = Number(inputRows[0]);
  return [calc1(input), calc2(input)];
}
