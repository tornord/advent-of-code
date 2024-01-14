import { sum } from "../../../common";

const diff = (xs) => {
  const res = [];
  for (let i = 1; i < xs.length; i++) {
    res.push(xs[i] - xs[i - 1]);
  }
  return res;
};

const diffs = (xs) => {
  let ds = xs.slice();
  const dss = [ds];
  do {
    ds = diff(ds);
    dss.push(ds);
    if (ds.every((d, _, a) => d === a[0])) break;
  } while (ds.length > 1);
  return dss;
};

function calc(input, part) {
  const res = [];
  const idx = part === 1 ? -1 : 0;
  const fun = part === 1 ? "push" : "unshift";
  const c = part === 1 ? 1 : -1;
  for (let y = 0; y < input.length; y++) {
    const dss = diffs(input[y]);
    let d0 = 0;
    for (let i = dss.length - 1; i >= 0; i--) {
      const d = dss[i].at(idx);
      d0 = d + d0 * c;
      dss[i][fun](d0);
    }
    res.push(dss[0].at(idx));
  }
  return sum(res);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/ /g).map(Number));
  return [calc(input, 1), calc(input, 2)];
}
