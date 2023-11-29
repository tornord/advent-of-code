import { sum } from "../../../common";

const { min, max } = Math;

function incIndices(idxs, minMaxs) {
  idxs[idxs.length - 1]++;
  for (let i = idxs.length - 1; i >= 1; i--) {
    if (idxs[i] >= minMaxs[i][1]) {
      idxs[i] = minMaxs[i][0];
      idxs[i - 1]++;
    }
  }
}
const loopIndices = (idxs, minMaxs) => idxs[0] < minMaxs[0][1];

function calc2(p1, p2) {
  const weapons = [8, 10, 25, 40, 74].map((d, i) => ({ cost: d, damage: i + 4, armor: 0 }));
  const armors = [13, 31, 53, 75, 102].map((d, i) => ({ cost: d, damage: 0, armor: i + 1 }));
  const rings = [25, 50, 100, 20, 40, 80].map((d, i) => ({
    cost: d,
    damage: i < 3 ? i + 1 : 0,
    armor: i >= 3 ? i - 2 : 0,
  }));
  const wins = [];
  const losses = [];
  const minMaxs = [
    [0, weapons.length],
    [-1, armors.length],
    [-1, rings.length],
    [-1, rings.length],
  ];
  const idxs = minMaxs.map((d) => d[0]);
  while (loopIndices(idxs, minMaxs)) {
    const [w, a, r1, r2] = idxs;
    if (r2 !== -1 && r2 === r1) {
      incIndices(idxs, minMaxs);
      continue;
    }
    const items = [weapons[w], a >= 0 ? armors[a] : null, r1 >= 0 ? rings[r1] : null, r2 >= 0 ? rings[r2] : null].filter(
      (d) => d !== null
    );
    const totCost = sum(items.map((d) => d.cost));
    p1.damage = sum(items.map((d) => d.damage));
    p1.armor = sum(items.map((d) => d.armor));
    const r = fight(p1, p2);
    if (r === 1) {
      wins.push(totCost);
    } else {
      losses.push(totCost);
    }
    incIndices(idxs, minMaxs);
  }
  return [min(...wins), max(...losses)];
}

function fight(p1, p2) {
  const n = 0;
  let hp1 = p1.hp;
  let hp2 = p2.hp;
  while (n < 120) {
    hp2 -= max(p1.damage - p2.armor, 1);
    if (hp2 <= 0) return 1;
    hp1 -= max(p2.damage - p1.armor, 1);
    if (hp1 <= 0) return -1;
  }
  return 0;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(":").slice(1)).map(Number);
  const p1 = input[0] === 12 ? { hp: 8, damage: 5, armor: 5 } : { hp: 100, damage: 0, armor: 0 };
  const p2 = { hp: input[0], damage: input[1], armor: input[2] };
  return calc2(p1, p2);
}
