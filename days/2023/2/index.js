import { sum, toDict } from "../../../common";

const { max } = Math;

function calc1(input) {
  const possible = (game) => (game.red ?? 0) <= 12 && (game.blue ?? 0) <= 14 && (game.green ?? 0) <= 13;
  const res = [];
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    if (!r.every(possible)) continue;
    res.push(y + 1);
  }
  return sum(res);
}

function calc2(input) {
  const res = [];
  for (const r of input) {
    const red = max(...r.map((d) => d.red ?? 0));
    const blue = max(...r.map((d) => d.blue ?? 0));
    const green = max(...r.map((d) => d.green ?? 0));
    res.push(red * green * blue);
  }
  return sum(res);
}

export default function (inputRows) {
  let input = [];
  for (let r of inputRows) {
    r = r.replace(/Game \d+: /, "").split(/; /).map((d) => d.split(/, /).map((e) => e.split(/ /))); // prettier-ignore
    input.push(r);
  }
  input = input.map((r) => r.map((d) => toDict(d, (e) => e[1], (e) => Number(e[0])))); // prettier-ignore
  return [calc1(input), calc2(input)];
}
