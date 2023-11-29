import { aStar, sum } from "../../../common";

const { abs } = Math;

function isLegal(s) {
  const { generators, microchips } = s;
  const sameMetalAndFloor = (d1, d2) => d1.floor === d2.floor && d1.metalIndex === d2.metalIndex;
  const sameFloorOtherMetal = (d1, d2) => d1.floor === d2.floor && d1.metalIndex !== d2.metalIndex;
  const ms = microchips.map((d) => ({
    hasOwnMetal: generators.findIndex((e) => sameMetalAndFloor(e, d)) >= 0,
    hasOtherMetal: generators.filter((e) => sameFloorOtherMetal(e, d)).length > 0,
  }));
  return ms.every((d) => d.hasOwnMetal || !d.hasOtherMetal);
}

function nextStates(s) {
  const nextFloors = [-1, 1].map((d) => s.elevatorFloor + d).filter((d) => d >= 1 && d <= 4);
  const units = [
    ...s.generators.map((d) => ({ item: d, type: "generator" })),
    ...s.microchips.map((d) => ({ item: d, type: "microchip" })),
  ];
  units.forEach((d, i) => (d.index = i));
  const us = units.filter((d) => d.item.floor === s.elevatorFloor);
  const combs = us.map((d) => [d.index]);
  for (let i = 0; i < us.length - 1; i++) {
    for (let j = i + 1; j < us.length; j++) {
      combs.push([us[i].index, us[j].index]);
    }
  }
  const res = [];
  for (const c of combs) {
    for (const f of nextFloors) {
      const cs = units.map((d) => ({ ...d, item: { ...d.item } }));
      c.forEach((d) => (cs[d].item.floor = f));
      const ns = {
        elevatorFloor: f,
        generators: cs.filter((d) => d.type === "generator").map((d) => d.item),
        microchips: cs.filter((d) => d.type === "microchip").map((d) => d.item),
        time: s.time + 1,
      };
      if (isLegal(ns)) {
        res.push(ns);
      }
    }
  }
  return res;
}

const toHash = (s) =>
  [s.elevatorFloor, ...s.generators.map((d) => d.floor), ...s.microchips.map((d) => d.floor)].join(",");

const hCost = (s) => sum(s.generators.map((d) => abs(4 - d.floor))) + sum(s.microchips.map((d) => abs(4 - d.floor)));
const gCost = (s0, s1) => s1.time - s0.time;

function calc({ generators, microchips }) {
  const start = { elevatorFloor: 1, generators, microchips, time: 0 };
  const costs = aStar(start, nextStates, gCost, hCost, toHash);
  const c = Object.values(costs).find((d) => d.h === 0);
  return c.g;
}

function parseInput(inputRows, withExtra = false) {
  const rs = inputRows.map((r) =>
    r
      .replace(/The|-compatible|nothing|relevant|\./g, "")
      .split(/,*\s+/g)
      .map((d) => d.replace(/^(a|and|floor|contains)$/, ""))
      .filter((e) => e !== "")
  );
  const generators = [];
  const microchips = [];
  const metalsSet = new Set();
  for (let i = 0; i < rs.length; i++) {
    let r = rs[i];
    if (withExtra && i === 0) {
      if (r.length === 5) {
        r.push(...["elerium", "generator", "elerium", "microchip"]);
        // r.push(...["dilithium", "generator", "dilithium", "microchip"]);
      } else {
        r = r.slice(0, -8);
      }
    }
    for (let j = 1; j < r.length; j += 2) {
      const [metal, type] = r.slice(j, j + 2);
      metalsSet.add(metal);
      if (type === "generator") {
        const g = { floor: i + 1, metal };
        generators.push(g);
      } else if (type === "microchip") {
        const m = { floor: i + 1, metal };
        microchips.push(m);
      }
    }
  }
  const metals = [...metalsSet];
  generators.forEach((d) => (d.metalIndex = metals.findIndex((e) => e === d.metal)));
  microchips.forEach((d) => (d.metalIndex = metals.findIndex((e) => e === d.metal)));
  generators.forEach((d) => delete d.metal);
  microchips.forEach((d) => delete d.metal);
  return { generators, microchips, metals };
}

export default function (inputRows) {
  const input1 = parseInput(inputRows, false);
  const input2 = parseInput(inputRows, true);
  const n1 = calc(input1);
  const n2 = calc(input2);
  return [n1, n1 + ((n2 - n1) * 2) / (input2.metals.length - input1.metals.length)];
}
