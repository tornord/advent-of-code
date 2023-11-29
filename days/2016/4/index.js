import { countBy } from "../../../common";

const { max, min } = Math;

function calc1(input) {
  let s = 0;
  for (let y = 0; y < input.length; y++) {
    let [name, id, checksum] = input[y];
    name = name.replace(/[-0-9]/g, "");
    const ns = Object.entries(countBy(name.split(""))).map(([k, v], i) => ({ k, v, i }));
    ns.sort((d1, d2) => {
      const c = d2.v - d1.v;
      return c !== 0 ? c : d1.i - d2.i;
    });
    const res = ns.slice();
    for (const r of res) {
      const { v } = r;
      const idxs = res.map((d, j) => [j, d]).filter((d) => d[1].v === v).map((d) => d[0]); // prettier-ignore
      r.minPlace = min(...idxs);
      r.maxPlace = max(...idxs);
    }
    let ok = true;
    for (let i = 0; i < checksum.length; i++) {
      const j = res.findIndex((d) => d.k === checksum[i]);
      if (j === -1) {
        ok = false;
        break;
      }
      if (i < res[j].minPlace || i > res[j].maxPlace) {
        ok = false;
        break;
      }
    }
    if (ok) {
      s += Number(id);
    }
  }
  return s;
}

const rotate = (s, n) => s.split("").map((d) => (d === "-" ? d : String.fromCharCode(97 + ((d.charCodeAt(0) - 97 + n) % 26)))).join(""); // prettier-ignore

function calc2(input) {
  for (let y = 0; y < input.length; y++) {
    let [name, id] = input[y];
    id = Number(id);
    name = rotate(name, id);
    if (name === "northpole-object-storage") {
      return id;
    }
  }
  return -1;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/[[\]]|-(?=[0-9])/g));
  return [calc1(input), calc2(input)];
}
