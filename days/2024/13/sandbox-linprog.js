import { solve as yalpsSolve } from "yalps";

function linprog(ax, ay, bx, by, sx, sy, d = 0) {
  const model = {
    direction: "minimize",
    objective: "cost",
    constraints: {
      x: { min: sx + d, max: sx + d },
      y: { min: sy + d, max: sy + d },
    },
    variables: {
      na: { x: ax, y: ay, cost: 3 },
      nb: { x: bx, y: by, cost: 1 },
    },
    integers: ["na", "nb"],
  };

  const solution = yalpsSolve(model);
  return solution;
}

console.log(linprog(94, 34, 22, 67, 8400, 5400)); // eslint-disable-line no-console

// {
//   status: 'optimal',
//   result: 280,
//   variables: [ [ 'na', 80 ], [ 'nb', 40 ] ]
// }
