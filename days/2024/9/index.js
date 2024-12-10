import { sum } from "../../../common";

function calc1(input) {
  const fsUsed = [];
  const fsFree = [];
  let i0 = 0;
  let id = 0;
  for (let x = 0; x < input.length; x += 2) {
    const v1 = Number(input[x]);
    const v2 = x < input.length - 1 ? Number(input[x + 1]) : 0;
    for (let i = 0; i < v1; i++) {
      fsUsed.push({ pos: i0 + i, id: id });
    }
    for (let i = 0; i < v2; i++) {
      fsFree.push({ pos: i0 + i + v1 });
    }
    i0 += v1 + v2;
    id++;
  }
  for (let i = 0; i < fsFree.length; i++) {
    const j = fsUsed.length - 1 - i;
    const fp = fsFree[i].pos;
    const fu = fsUsed[j].pos;
    if (fu <= fp) break;
    fsUsed[j].pos = fp;
  }
  fsUsed.sort((a, b) => a.pos - b.pos);
  const res = sum(fsUsed.map((f) => f.pos * Number(f.id)));
  return res;
}

function calc2(input) {
  const fsUsed = [];
  const fsFree = [];
  let i0 = 0;
  let id = 0;
  for (let x = 0; x < input.length; x += 2) {
    const v1 = Number(input[x]);
    fsUsed.push({ pos: i0, size: v1, id: id });
    let v2 = 0;
    if (x < input.length - 1) {
      v2 = Number(input[x + 1]);
      fsFree.push({ pos: i0 + v1, size: v2 });
    }
    i0 += v1 + v2;
    id++;
  }
  for (let i = fsUsed.length - 1; i >= 0; i--) {
    const fu = fsUsed[i];
    const fp = fsFree.find((f) => f.pos < fu.pos && f.size >= fu.size);
    if (!fp) continue;
    fu.pos = fp.pos;
    fp.pos += fu.size;
    fp.size -= fu.size;
  }
  fsUsed.sort((a, b) => a.pos - b.pos);
  for (let i = 0; i < fsUsed.length; i++) {
    const fu = fsUsed[i];
    let n = 0;
    for (let j = 0; j < fu.size; j++) {
      n += fu.pos + j;
    }
    fu.checksum = n * fu.id;
  }
  const res = sum(fsUsed.map((f) => f.checksum));
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""))[0];
  return [calc1(input), calc2(input)];
}
