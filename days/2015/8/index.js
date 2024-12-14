import { countBy, sum } from "../../../common";

function calc1(rows) {
  const nIns = rows.map((r) => r.length);
  const nOuts = rows.map((r) => {
    r = r.slice(1, -1).replace(/\\(\\|"|x[0-9a-f]{2})/g, "x");
    return r.length;
  });
  return sum(nIns) - sum(nOuts);
}

function calc2(rows) {
  const nIns = rows.map((r) => r.length);
  const nOuts = rows.map((r) => {
    r = r.slice(1, -1);
    const gs = countBy(r.split(""));
    return r.length + 6 + (gs["\\"] ?? 0) + (gs["\""] ?? 0); // prettier-ignore
  });
  return sum(nOuts) - sum(nIns);
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r);
  return [calc1(rows), calc2(rows)];
}
