import { sum } from "../../../common";

export default function (inputRows) {
  const rows = inputRows.map((r) => (r !== "" ? Number(r) : null));
  if (rows.at(-1) !== null) {
    rows.push(null);
  }
  const breaks = rows
    .map((d, i) => [d, i])
    .filter((d) => d[0] === null)
    .map((d) => d[1]);
  const ms = [];
  for (let i = 0; i < breaks.length; i++) {
    const b = breaks[i];
    const d = rows.slice(i === 0 ? 0 : breaks[i - 1] + 1, b);
    const s = sum(d);
    ms.push(s);
  }
  ms.sort((d1, d2) => d2 - d1);
  return [ms[0], sum(ms.slice(0, 3))];
}
