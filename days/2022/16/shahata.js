import fs from "fs"

function distance(valves, valve, id) {
  const queue = [{ id: valve.id, steps: 0 }];
  const visited = new Set(`${valve.id},0`);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.id === id) return current.steps;
    const neighbors = valves[current.id].destination
      .map((_id) => ({ id: _id, steps: current.steps + 1 }))
      .filter((x) => !visited.has(`${x.id},${x.steps}`));
    neighbors.forEach((x) => visited.add(`${x.id},${x.steps}`));
    queue.push(...neighbors);
  }
}

function parse(input) {
  const valves = input
    .split("\n")
    .map((line) => {
      const [, id, rate, destination] = line.match(
        /^Valve ([^\s]+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/
      );
      return { id, rate: +rate, destination: destination.split(", ") };
    })
    .reduce((obj, valve) => ({ ...obj, [valve.id]: valve }), {});
  Object.values(valves).forEach((valve) => {
    valve.paths = Object.values(valves)
      .filter(({ id, rate }) => id !== valve.id && rate > 0)
      .map(({ id }) => ({ id, distance: distance(valves, valve, id) }));
  });
  return valves;
}

function best(valves, current, open, pressure, time, elephant) {
  if (time === 0) return pressure;
  const results = valves[current].paths
    .filter(({ id, distance: _distance }) => !open.has(id) && time > _distance)
    .flatMap(({ id, distance: _distance }) => {
      const nextOpen = new Set(open).add(id);
      const nextPressure = pressure + valves[id].rate * (time - _distance - 1);
      return [
        best(valves, id, nextOpen, nextPressure, time - _distance - 1, elephant),
        elephant && best(valves, "AA", nextOpen, nextPressure, 26, !elephant),
      ];
    });
  const m = Math.max(pressure, ...results)
  return m;
}

export function part1(input) {
  const valves = parse(input);
  return best(valves, "AA", new Set(), 0, 30, false);
}

export function part2(input) {
  const valves = parse(input);
  return best(valves, "AA", new Set(), 0, 26, true);
}

console.log(part1(fs.readFileSync("./days/2022/16/test1.txt","utf-8")));
// console.log(part2(fs.readFileSync("./days/2022/16/skip.example.txt","utf-8")));
// console.log(part2(fs.readFileSync("./days/2022/16/input.txt","utf-8")));
