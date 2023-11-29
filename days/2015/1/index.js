import { sum } from "../../../common";

function calc2(lvls) {
  // eslint-disable-next-line
  const accLvl = lvls.reduce((p, c) => (p.push(p.at(-1) + c), p), [0]);
  return accLvl.findIndex((d) => d === -1);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  const lvls = input[0].map((d) => (d === "(" ? 1 : -1));
  return [sum(lvls), calc2(lvls)];
}
