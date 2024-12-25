import { parseTable, splitArray, toDict } from "../../../common";

const { floor, max, random } = Math;

const newGate = (id, v) => ({ id, v, i1: null, i2: null, c: null });

const addRule = (gd, r) => {
  const [i1, c, i2, _, id] = r;
  if (!gd[id]) {
    gd[id] = newGate(id, null);
  }
  if (!gd[i1]) {
    gd[i1] = newGate(i1, null);
  }
  if (!gd[i2]) {
    gd[i2] = newGate(i2, null);
  }
  const g = gd[id];
  g.i1 = i1;
  g.i2 = i2;
  g.c = c;
};

const getGateDict = (inits, gateRules) => {
  const gates = inits.map((d) => newGate(d[0] + d[1], d[2]));
  const gd = toDict(
    gates,
    (d) => d.id,
    (d) => d
  );
  for (const r of gateRules) {
    addRule(gd, r);
  }
  return gd;
};

const newExprNode = (id, c, i1, i2, v) => ({ id, c, i1, i2, v });

const getExprTree = (id, gd) => {
  let n = 0;
  const g = gd[id];
  const res = newExprNode(id, g.c, g.i1, g.i2, g.v);
  const q = [res];
  while (q.length) {
    const q0 = q.shift();
    const g0 = gd[q0.id];
    if (!g0.c || !g0.i1 || !g0.i2) continue;
    const gi1 = gd[g0.i1];
    const t1 = newExprNode(g0.i1, gi1.c, gi1.i1, gi1.i2, gi1.v);
    q0.i1 = t1;
    if (t1.c) {
      q.push(t1);
    }
    const gi2 = gd[g0.i2];
    const t2 = newExprNode(g0.i2, gi2.c, gi2.i1, gi2.i2, gi2.v);
    q0.i2 = t2;
    if (t2.c) {
      q.push(t2);
    }
    if (n++ === 1000) {
      throw new Error("too many iterations");
    }
  }
  return res;
};

// eslint-disable-next-line no-unused-vars
function exprToString(t) {
  if (!t.c) {
    return t.id;
  }
  const s1 = exprToString(t.i1);
  const s2 = exprToString(t.i2);
  return `(${s1} ${t.c} ${s2})`;
}

function exprToString2(t, ind) {
  if (!t.c) {
    return [`${" ".repeat(ind)}${t.id}`];
  }
  const s1 = exprToString2(t.i1, ind + 2);
  const s2 = exprToString2(t.i2, ind + 2);
  return [`${" ".repeat(ind)}${t.c} (${t.id})`, ...s1, ...s2];
}

function solveValues(gd) {
  while (true) {
    const newVals = [];
    for (const [id, g] of Object.entries(gd)) {
      if (!g.c || !g.i1 || !g.i2) continue;
      const gi1 = gd[g.i1];
      const gi2 = gd[g.i2];
      const c = g.c;
      const v = g.v;
      let v1 = null;
      // not needed here but the logic handles tristate (null) values
      if (c === "AND") {
        if (gi1.v === 0 || gi2.v === 0) {
          v1 = 0;
        } else if (gi1.v === 1 && gi2.v === 1) {
          v1 = 1;
        }
      } else if (c === "OR") {
        if (gi1.v === 1 || gi2.v === 1) {
          v1 = 1;
        } else if (gi1.v === 0 && gi2.v === 0) {
          v1 = 0;
        }
      } else if (c === "XOR") {
        if (gi1.v !== null && gi2.v !== null) {
          if (gi1.v === 1 && gi2.v === 0) {
            v1 = 1;
          } else if (gi1.v === 0 && gi2.v === 1) {
            v1 = 1;
          } else {
            v1 = 0;
          }
        }
      }
      if (v === v1) continue;
      newVals.push({ id, v: v1 });
    }
    if (newVals.length === 0) {
      break;
    }
    for (const nv of newVals) {
      gd[nv.id].v = nv.v;
    }
  }
}

function calc1(inits, gateRules) {
  const gd = getGateDict(inits, gateRules);
  solveValues(gd);
  const zs = Object.values(gd)
    .filter((g) => g.id.startsWith("z"))
    .sort((a, b) => -a.id.localeCompare(b.id));
  const res = parseInt(zs.map((z) => z.v).join(""), 2);
  return res;
}

const swap = (gd, id1, id2) => {
  const g1 = gd[id1];
  const g2 = gd[id2];
  gd[id1] = g2;
  gd[id2] = g1;
  g1.id = id2;
  g2.id = id1;
};

const getByType = (gd, type) =>
  Object.values(gd)
    .filter((g) => g.id.startsWith(type))
    .sort((a, b) => -a.id.localeCompare(b.id));

function getXyz(gd) {
  const xs = getByType(gd, "x");
  const ys = getByType(gd, "y");
  const zs = getByType(gd, "z");
  if (zs.length > xs.length) {
    xs.unshift(newGate(zs[0].id.replace("z", "x"), 0));
  }
  if (zs.length > ys.length) {
    ys.unshift(newGate(zs[0].id.replace("z", "y"), 0));
  }
  return [xs, ys, zs];
}

// The pairs were found by studying the expressions for each z. A correct add expression for an output (zn) should be:
// XOR on top of 1) XOR, which adds the last bits and 2) OR, which handles carry bits, always 2 ANDs.
// zn =
//   XOR (zn)
//     OR (tpv)
//       AND (tng)
//         yn-1
//         xn-1
//       AND (pwk)
//         OR (kpf)
//           ...
//           ...
//           ...
//         XOR (qpd)
//           yn-1
//           xn-1
//     XOR (npk)
//       xn
//       yn
function calc2(inits, gateRules) {
  const gdOrig = getGateDict(inits, gateRules);
  const zs0 = getByType(gdOrig, "z");
  const pairs = [
    ["z09", "gwh"],
    ["wgb", "wbw"],
    ["z21", "rcb"],
    ["z39", "jct"],
  ];
  let diffSums = zs0.map(() => 0);
  for (let j = 1; j <= 40; j++) {
    const N = floor(random() * 2 ** (zs0.length - 1));
    const nx = floor(random() * N);
    const ny = N - nx;
    const x = Number(nx).toString(2).split("").map(Number);
    const y = Number(ny).toString(2).split("").map(Number);
    while (x.length < y.length) {
      x.unshift(0);
    }
    while (y.length < x.length) {
      y.unshift(0);
    }
    const nxy = max(x.length, y.length);
    const gd = toDict(
      Object.values(gdOrig),
      (d) => d.id,
      (d) => ({ ...d })
    );
    for (let i = 0; i < pairs.length; i++) {
      const [id1, id2] = pairs[i];
      swap(gd, id1, id2);
    }
    const [xs, ys, zs] = getXyz(gd);
    for (let i = 0; i < xs.length; i++) {
      xs[i].v = 0;
      ys[i].v = 0;
    }
    for (let i = 0; i < nxy; i++) {
      xs[xs.length + i - nxy].v = i < x.length ? x[i] : 0;
      ys[ys.length + i - nxy].v = i < y.length ? y[i] : 0;
    }
    solveValues(gd);

    // eslint-disable-next-line no-unused-vars
    const exprs = zs.map((z) => {
      const t = getExprTree(z.id, gd);
      // let s = `${exprToString(t)}`;
      const s = [`${z.id} = `, ...exprToString2(t, 2)];
      return s;
    });
    const z = zs.map((d) => d.v).join("");
    const zCorrect = BigInt(nx + ny)
      .toString(2)
      .padStart(z.length, "0");
    const diffs = zCorrect.split("").map((d, i) => {
      const v = z[i];
      return d === v ? 0 : 1;
    });
    diffSums = diffSums.map((d, i) => d + diffs[i]);
  }
  // ensure each sum of all diffs are 0
  console.log(diffSums.join(", ")); // eslint-disable-line no-console
  diffSums = null;
  return pairs.flat().toSorted().join(",");
}

export default function (inputRows) {
  const inputGroups = splitArray(inputRows, (r) => r === "");
  const inits = parseTable(inputGroups[0]);
  const gateRules = inputGroups[1].map((r) => r.split(" "));
  return [calc1(inits, gateRules), calc2(inits, gateRules)];
}
