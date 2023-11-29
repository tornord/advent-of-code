import { dijkstra, sum } from "../../../common";

function calc1(input) {
  const revMap = {};
  input.forEach(([k, v]) => v.forEach(([, d]) => (revMap[d] ??= []).push(k)));
  const backwardNeighbors = (n) => revMap[n] ?? [];
  const cs = dijkstra("shiny gold", backwardNeighbors);
  return Object.keys(cs).length - 1;
}

function bagsInside(input, bag) {
  return sum(input.find((d) => d[0] === bag)[1].map(([n, d]) => n * (1 + bagsInside(input, d))));
}

function calc2(input) {
  return bagsInside(input, "shiny gold");
}

function parseContent(s) {
  const rs = s.split(/, /).map((d) => d.replace(/ bags?\.?/, ""));
  return rs.map((d) => d.split(/(?<=\d+) /)).map(([n, d]) => [Number(n), d]);
}

export default function (inputRows) {
  const input = inputRows
    .map((r) => r.split(/ bags contain /))
    .map((d) => [d[0], d[1] === "no other bags." ? [] : parseContent(d[1])]);
  return [calc1(input), calc2(input)];
}
