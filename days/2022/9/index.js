import { newArray } from "../../../common";

const { abs, min, max } = Math;

const STEPS = { U: { x: 0, y: -1 }, D: { x: 0, y: 1 }, R: { x: 1, y: 0 }, L: { x: -1, y: 0 } };

const moveHead = (h, c, mn = 0, mx = 5) => {
  const r = STEPS[c];
  const add = (m, d) => {
    if (!mn && !mx) {
      m.x = m.x + d.x;
      m.y = m.y + d.y;
    } else {
      m.x = max(min(m.x + d.x, mx), 0);
      m.y = max(min(m.y + d.y, mx), 0);
    }
  };
  add(h, r);
};

const moveTail = (h, t) => {
  let d = { x: h.x - t.x, y: h.y - t.y };
  while (d === null || abs(d.x) > 1 || abs(d.y) > 1) {
    t.x += d.x > 0 ? 1 : d.x < 0 ? -1 : 0;
    t.y += d.y > 0 ? 1 : d.y < 0 ? -1 : 0;
    d = { x: h.x - t.x, y: h.y - t.y };
  }
};

function calc(rows, nm) {
  const ny = rows.length;
  const ms = newArray(nm, () => ({ x: 0, y: 4 }));

  const tgrid = {};
  tgrid[`${ms.at(-1).x},${ms.at(-1).y}`] = true;
  for (let i = 0; i < ny; i++) {
    const [c, n] = rows[i];
    for (let j = 0; j < n; j++) {
      moveHead(ms[0], c, null, null);
      for (let k = 1; k < ms.length; k++) {
        moveTail(ms[k - 1], ms[k]);
      }

      // let pos = newMatrix(5, 6, () => " ");
      // let names = ["H", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      // for (let k = 0; k < names.length; k++) {
      //   pos[ms[k].y][ms[k].x] = names[k];
      // }
      // console.table(pos);

      tgrid[`${ms.at(-1).x},${ms.at(-1).y}`] = true;
    }
  }
  return Object.keys(tgrid).length;
}

export default function (inputRows) {
  const rs = inputRows.map((r) => r.split(" ").map((d, i) => (i === 0 ? d : Number(d))));
  return [calc(rs, 2), calc(rs, 10)];
}
