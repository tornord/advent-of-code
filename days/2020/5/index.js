import { toDict } from "../../../common";

const { max, min } = Math;

const toBinary = (s, c) => parseInt(s.split("").map((d) => d === c ? 1 : 0).join(""), 2); // prettier-ignore

function getSeats(input) {
  return input.map((r) => {
    const x = toBinary(r.slice(0, 7), "B");
    const y = toBinary(r.slice(7, 10), "R");
    return { x, y, id: x * 8 + y };
  });
}

function calc1(input) {
  const ss = getSeats(input);
  return max(...ss.map((d) => d.id));
}

function calc2(input) {
  const seats = getSeats(input);
  const dict = toDict(seats, (d) => d.id, (d) => d); // prettier-ignore
  const mn = min(...seats.map((d) => d.id));
  const mx = max(...seats.map((d) => d.id));
  for (let i = mn; i <= mx; i++) {
    if (!(i in dict)) return i;
  }
  return 0;
}

export default function (inputRows) {
  const input = inputRows;
  return [calc1(input), calc2(input)];
}
