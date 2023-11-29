import { dijkstra, dijkstraFindPath, newArray, swap } from "../../../common";
import { strict as assert } from "node:assert";

const ENERGY_EXP = 10;

function createBoard(homeSize) {
  const homes = {};
  for (let i = 0; i < 4; i++) {
    const [c, C] = [97, 65].map((d) => String.fromCharCode(d + i));
    homes[C] = { nodes: newArray(homeSize, (j) => `${c}${j + 1}`), energy: ENERGY_EXP ** i };
  }

  const graph = {
    a1: { edges: { h2: 2, h3: 2, a2: 1 } },
    b1: { edges: { h3: 2, h4: 2, b2: 1 } },
    c1: { edges: { h4: 2, h5: 2, c2: 1 } },
    d1: { edges: { h5: 2, h6: 2, d2: 1 } },
    h1: { edges: { h2: 1 } },
    h2: { edges: { h1: 1, h3: 2, a1: 2 } },
    h3: { edges: { h2: 2, h4: 2, a1: 2, b1: 2 } },
    h4: { edges: { h3: 2, h5: 2, b1: 2, c1: 2 } },
    h5: { edges: { h4: 2, h6: 2, c1: 2, d1: 2 } },
    h6: { edges: { h5: 2, h7: 1, d1: 2 } },
    h7: { edges: { h6: 1 } },
  };
  Object.values(homes).forEach((d) => {
    for (let i = 1; i < d.nodes.length; i++) {
      const n = d.nodes[i];
      const edges = {};
      edges[d.nodes[i - 1]] = 1;
      if (i < d.nodes.length - 1) {
        edges[d.nodes[i + 1]] = 1;
      }
      graph[n] = { edges };
    }
  });
  const neighbors = (n) => Object.keys(graph[n].edges);

  function addOutMove(fromNode, toId) {
    if (!fromNode.outMoves) {
      fromNode.outMoves = [];
    }
    if (!fromNode.outMoves.find((d) => d === toId)) {
      fromNode.outMoves.push(toId);
    }
  }

  const ns = Object.entries(graph);
  ns.sort((d1, d2) => (d1[0] < d2[0] ? -1 : 1));
  ns.forEach(([k, v], i) => {
    v.id = k;
    v.index = i;
    v.costs = dijkstra(k, neighbors, (n1, n2) => graph[n1].edges[n2]);
    if (!v.outMoves) {
      v.outMoves = [];
    }
    v.home = null;
  });
  const squares = Object.values(graph);
  squares.sort((d1, d2) => d1.index - d2.index);
  Object.entries(homes).forEach(([k, v]) => {
    v.id = k;
    v.nodes.forEach((d) => {
      const n = graph[d];
      n.home = v.id;
      for (let i = 1; i <= 7; i++) {
        const ps = dijkstraFindPath(n.costs, `h${i}`, neighbors).reverse();
        for (let j = 1; j < ps.length; j++) {
          addOutMove(graph[ps[j - 1]], ps[j]);
        }
      }
    });
  });
  return { graph, homes, squares, neighbors };
}
const b2 = createBoard(2);
const b4 = createBoard(4);

function findFreeHs({ graph }, n, s) {
  const res = {};
  const queue = n.outMoves.map((d) => graph[d]);
  while (queue.length > 0) {
    const q = queue.pop();
    if (s[q.index] !== " ") continue;
    if (q.home === null) {
      res[q.id] = true;
    }
    q.outMoves.forEach((d) => {
      if (!(d in res)) {
        queue.push(graph[d]);
      }
    });
  }
  return Object.keys(res);
}

function isHomeFree({ graph, homes }, s, c) {
  return homes[c].nodes.map((d) => graph[d].index).every((d) => s[d] === " " || s[d] === c);
}
assert.deepEqual(isHomeFree(b2, "      D ", "D"), true);
assert.deepEqual(isHomeFree(b4, "                ", "A"), true);
assert.deepEqual(isHomeFree(b4, "XX              ", "A"), false);
assert.deepEqual(isHomeFree(b4, "  BB C          ", "C"), true);

function moveHome(board, s) {
  const { squares, homes, neighbors, graph } = board;
  let res = s;
  let energy = 0;
  const cs = res
    .split("")
    .map((d, i) => [squares[i], d])
    .filter((d) => d[1] !== " ")
    .filter((d) => d[0].home === null || d[0].home !== d[1]);
  let cc = cs.length > 0 ? cs[0][0] : null;
  const findFun = (d) => res[d.index] === " ";
  while (cs.length > 0 && cc !== null) {
    cc = null;
    for (let i = 0; i < cs.length; i++) {
      const [n, c] = cs[i];
      if (!isHomeFree(board, res, c)) continue;
      const ns = homes[c].nodes.map((d) => graph[d]);
      const t = ns.findLast(findFun);
      const ps = dijkstraFindPath(t.costs, n.id, neighbors);
      const pathNodes = ps.slice(1).map((d) => graph[d]);
      if (!pathNodes.every(findFun)) continue;
      energy += t.costs[n.id] * homes[c].energy;
      const ss = res.split("");
      swap(ss, n.index, t.index);
      res = ss.join("");
      cs.splice(i, 1);
      cc = t;
      break;
    }
  }
  return { pos: res, energy };
}
const nrg2 = ENERGY_EXP;
const nrg3 = ENERGY_EXP ** 2;
const nrg4 = ENERGY_EXP ** 3;
assert.deepEqual(moveHome(b2, "        AA     "), { pos: "AA             ", energy: 6 });
assert.deepEqual(moveHome(b4, "                AA     "), { pos: "  AA                   ", energy: 10 });
assert.deepEqual(moveHome(b4, "                AAAA   "), { pos: "AAAA                   ", energy: 17 });
assert.deepEqual(moveHome(b4, "                ABAB   "), { pos: "  AA  BB               ", energy: 10 + 11 * nrg2 }); // prettier-ignore
assert.deepEqual(moveHome(b4, "                ACAC   "), { pos: "  AA      CC           ", energy: 13 * nrg3 + 10 }); // prettier-ignore
assert.deepEqual(moveHome(b4, "                DCDC   "), { pos: "          CC  DD       ", energy: 20 * nrg4 + 13 * nrg3 }); // prettier-ignore
assert.deepEqual(moveHome(b2, "  CC    AB     "), { pos: " A BCC         ", energy: 4 + 5 * nrg2 + 10 * nrg3 }); // prettier-ignore
assert.deepEqual(moveHome(b4, "  BA  CD  BC  DA       "), { pos: "  BA  CD  BC  DA       ", energy: 0 });
assert.deepEqual(moveHome(b4, "   A  CD  BC  DA    B  "), { pos: "   A  CD  BC  DA    B  ", energy: 0 });
assert.deepEqual(moveHome(b2, "BACD C D  B  A "), { pos: "AABBCCDD       ", energy: 8 + 7 * nrg2 + 4 * nrg3 + 7 * nrg4 }); // prettier-ignore

function nextStates(board, { pos, energy }) {
  const { homes, graph } = board;
  const possibleMoves = [];
  for (const c in homes) {
    let skip = true;
    const hs = homes[c].nodes.map((d) => graph[d]);
    for (let i = hs.length - 1; i >= 0; i--) {
      const n = hs[i];
      if (skip && pos[n.index] === c) continue;
      skip = false;
      if (pos[n.index] !== " ") {
        possibleMoves.push(n.id);
      }
    }
  }
  const res = [];
  for (const m of possibleMoves) {
    const nm = graph[m];
    const freeHs = findFreeHs(board, nm, pos);
    for (const h of freeHs) {
      const ss = pos.split("");
      const nrg = graph[h].costs[m] * homes[pos[nm.index]].energy;
      swap(ss, nm.index, graph[h].index);
      const res2 = moveHome(board, ss.join(""));
      res.push({ pos: res2.pos, energy: energy + nrg + res2.energy });
    }
  }
  return res;
}

function isEndState({ homes, graph }, { pos }) {
  for (const c in homes) {
    for (const n of homes[c].nodes) {
      if (pos[graph[n].index] !== c) return false;
    }
  }
  return true;
}
assert.deepEqual(isEndState(b2, { pos: "AABBCCDD" }), true);
assert.deepEqual(isEndState(b4, { pos: "AAAABBBBCCCCDDDD" }), true);
assert.deepEqual(isEndState(b4, { pos: "  BB  AA  CC  DD" }), false);

function calc(board, inputRows) {
  const input = inputRows.slice(2, inputRows.length - 1).map((r) => [3, 5, 7, 9].map((d) => r[d]));
  const startPos = input[0]
    .map((d, i) => input.map((e) => e[i]))
    .flat()
    .join("")
    .padEnd(board.squares.length, " ");
  const startState = { pos: startPos, energy: 0 };
  const queue = [startState];
  let minEnergy = Number.MAX_VALUE;
  while (queue.length > 0) {
    const q = queue.pop();
    const ns = nextStates(board, q);
    for (const n of ns) {
      if (isEndState(board, n)) {
        if (n.energy < minEnergy) {
          minEnergy = n.energy;
        }
        continue;
      }
      queue.push(n);
    }
  }
  return minEnergy;
}

export default function (inputRows) {
  const board2 = createBoard(2);
  const board4 = createBoard(4);
  const inputRows2 = inputRows.slice();
  const inputRows4 = inputRows.slice();
  inputRows4.splice(3, 0, "  #D#C#B#A#  ");
  inputRows4.splice(4, 0, "  #D#B#A#C#  ");
  return [calc(board2, inputRows2), calc(board4, inputRows4)];
}
