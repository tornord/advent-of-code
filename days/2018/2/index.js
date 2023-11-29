import { countBy, groupBy } from "../../../common";

function countLetters(str) {
  const cs = countBy(str.split(""), (d) => d);
  return groupBy(
    Object.entries(cs),
    (d) => d[1],
    (d) => d[0]
  );
}

function calc1(input) {
  let n2 = 0;
  let n3 = 0;
  for (let i = 0; i < input.length; i++) {
    const r = input[i];
    const cs = countLetters(r);
    n2 += (cs[2]?.length ?? 0) > 0 ? 1 : 0;
    n3 += (cs[3]?.length ?? 0) > 0 ? 1 : 0;
  }
  return n2 * n3;
}

function calc2(input) {
  for (let i = 0; i < input.length - 1; i++) {
    const ri = input[i].split("");
    for (let j = i + 1; j < input.length; j++) {
      const rj = input[j].split("");
      const diffs = ri.map((d, k) => [d, k]).filter(([d], k) => d !== rj[k]);
      if (diffs.length === 1) {
        const ci = diffs[0][1];
        return ri.filter((d, k) => k !== ci).join("");
      }
    }
  }
  return "";
}

export default function (inputRows) {
  const input = inputRows.map((r) => r);
  return [calc1(input), calc2(input)];
}
