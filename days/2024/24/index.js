import { strict as assert } from "node:assert";

import { sum, prod, range, newArray, newMatrix, transpose, isNumeric } from "../../../common";
import { intersectionSet, reduceSet, unionSet } from "../../../common";
import { toDict, groupBy, countBy, uniquePermutations, indexOf } from "../../../common";
import { matchNumbers, parseTable, splitArray, unitCircle } from "../../../common";

const { abs, ceil, floor, max, min, random, round, sign, sqrt } = Math;
const { isArray } = Array;

// const DIRS = unitCircle(4); // right, down, left, up
// const DIRS = unitCircle(8); // right, right-down, down, left-down, left, left-up, up, right-up
// const DIRS = unitCircle(4, 0, 45); // right-down, left-down, left-up, right-up

const newGate = (id, v) => ({ id, v, i1: null, i2: null, c: null });

const addRule = (gd, r) => {
  let [i1, c, i2, _, id] = r;
  if (!gd[id]) {
    gd[id] = newGate(id, null);
  }
  if (!gd[i1]) {
    gd[i1] = newGate(i1, null);
  }
  if (!gd[i2]) {
    gd[i2] = newGate(i2, null);
  }
  let g = gd[id];
  g.i1 = i1;
  g.i2 = i2;
  g.c = c;
};

const getGateDict = (inits, gateRules) => {
  let gates = inits.map((d) => newGate(d[0] + d[1], d[2]));
  let gd = toDict(
    gates,
    (d) => d.id,
    (d) => d
  );
  for (let r of gateRules) {
    addRule(gd, r);
  }
  return gd;
};

const newTreeNode = (id, c, i1, i2, v) => ({ id, c, i1, i2, v });

const getExprTree = (id, gd) => {
  let n = 0;
  let g = gd[id];
  let res = newTreeNode(id, g.c, g.i1, g.i2, g.v);
  let q = [res];
  while (q.length) {
    let t = q.shift();
    let g = gd[t.id];
    if (!g.c || !g.i1 || !g.i2) continue;
    let t1 = newTreeNode(g.i1, gd[g.i1].c, gd[g.i1].i1, gd[g.i1].i2, gd[g.i1].v);
    t.i1 = t1;
    if (t1.c) {
      q.push(t1);
    }
    let t2 = newTreeNode(g.i2, gd[g.i2].c, gd[g.i2].i1, gd[g.i2].i2, gd[g.i2].v);
    t.i2 = t2;
    if (t2.c) {
      q.push(t2);
    }
    if (n++ === 1000) {
      throw new Error("too many iterations");
    }
  }
  return res;
};

function exprToString(t) {
  if (!t.c) {
    // if (t.v !== null) {
    //   return t.v;
    // }
    return t.id;
  }
  let s1 = exprToString(t.i1);
  let s2 = exprToString(t.i2);
  return `(${s1} ${t.c} ${s2})`;
}

function exprToString2(t, ind) {
  if (!t.c) {
    // if (t.v !== null) {
    //   return t.v;
    // }
    return [`${" ".repeat(ind)}${t.id}`];
  }
  let s1 = exprToString2(t.i1, ind + 2);
  let s2 = exprToString2(t.i2, ind + 2);
  return [`${" ".repeat(ind)}${t.c} (${t.id})`, ...s1, ...s2];
}

function solveValues(gd) {
  while (true) {
    let newVals = [];
    for (const [id, g] of Object.entries(gd)) {
      if (!g.c || !g.i1 || !g.i2) continue;
      let gi1 = gd[g.i1];
      let gi2 = gd[g.i2];
      let c = g.c;
      let v = g.v;
      let v1 = null;
      // if (gi1.v === null && gi2.v === null) {
      //   v1 = null;
      // } else
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
    for (let nv of newVals) {
      gd[nv.id].v = nv.v;
    }
  }
}

function calc1(inits, gateRules) {
  let gd = getGateDict(inits, gateRules);
  solveValues(gd);
  let zs = Object.values(gd)
    .filter((g) => g.id.startsWith("z"))
    .sort((a, b) => -a.id.localeCompare(b.id));
  let res = parseInt(zs.map((z) => z.v).join(""), 2);
  return res;
}

function swap(gd, id1, id2) {
  let g1 = gd[id1];
  let g2 = gd[id2];
  gd[id1] = g2;
  gd[id2] = g1;
  g1.id = id2;
  g2.id = id1;
}

function getXyz(gd) {
  let xs = Object.values(gd)
    .filter((g) => g.id.startsWith("x"))
    .sort((a, b) => -a.id.localeCompare(b.id));
  let ys = Object.values(gd)
    .filter((g) => g.id.startsWith("y"))
    .sort((a, b) => -a.id.localeCompare(b.id));
  let zs = Object.values(gd)
    .filter((g) => g.id.startsWith("z"))
    .sort((a, b) => -a.id.localeCompare(b.id));
  if (zs.length > xs.length) {
    xs.unshift(newGate(zs[0].id.replace("z", "x"), 0));
  }
  if (zs.length > ys.length) {
    ys.unshift(newGate(zs[0].id.replace("z", "y"), 0));
  }
  return [xs, ys, zs];
}

function calc2(inits, gateRules) {
  let gd0 = getGateDict(inits, gateRules);
  let [xs0, ys0, zs0] = getXyz(gd0);
  // swap(gd, "z01", "z02");

  for (let k = 10; k <= 45; k++) {
    console.log("k", k);
    let res = [];
    for (let j = 1; j <= 40; j++) {
      let N = floor(Math.random() * 2 ** 45); // 2 ** j  + 2 ** 13 + 2 ** 14;// + 2 ** 21;
      let nx = floor(Math.random() * N); //(N - (N % 2)) / 2;
      let ny = N - nx;
      let x = Number(nx).toString(2).split("").map(Number);
      let y = Number(ny).toString(2).split("").map(Number);
      while (x.length < y.length) {
        x.unshift(0);
      }
      while (y.length < x.length) {
        y.unshift(0);
      }
      let nxy = max(x.length, y.length);
      // if (j === 9) continue;
      let gd = toDict(
        Object.values(gd0),
        (d) => d.id,
        (d) => ({ ...d })
      );
      swap(gd, "z09", "gwh");
      swap(gd, "wgb", "wbw");
      swap(gd, "z21", "rcb");
      swap(gd, "z39", "jct");
      console.log(["z09", "gwh", "wgb", "wbw", "z21", "rcb", "z39", "jct"].sort().join(","));
      // swap(gd, "z21", "z10");
      // swap(gd, "z13", "z40");
      // swap(gd, "z09", "z10");
      // swap(gd, "z39", "z40");
      // swap(gd, "z21", "z22");
      // swap(gd, "z13", "z14");
      // swap(gd, "z09", "z" + String(k).padStart(2, "0"));
      let [xs, ys, zs] = getXyz(gd);
      for (let i = 0; i < xs.length; i++) {
        xs[i].v = 0;
        xs0[i].v = 0;
        ys[i].v = 0;
        ys0[i].v = 0;
      }
      for (let i = 0; i < nxy; i++) {
        xs[xs.length + i - nxy].v = i < x.length ? x[i] : 0;
        xs0[xs0.length + i - nxy].v = i < x.length ? x[i] : 0;
        ys[ys.length + i - nxy].v = i < y.length ? y[i] : 0;
        ys0[ys0.length + i - nxy].v = i < y.length ? y[i] : 0;
      }
      // xs[j].v = 0;
      // ys[j].v = 0;
      solveValues(gd0);
      solveValues(gd);
      let exprs = zs.map((z) => {
        let t = getExprTree(z.id, gd);
        // let s = `${exprToString(t)}`;
        let s = [`${z.id} = `, ...exprToString2(t, 2)];
        return s;
      });
      // let zrs = zs.map((d, i) => zs[ws[i]]);
      let z = zs.map((z) => (z.v === null ? "x" : z.v)).join("");
      let nz = parseInt(z.replace(/x/g, "0"), 2);
      let zc = BigInt(nx + ny)
        .toString(2)
        .padStart(z.length, "0");
      let nd = nz - nx - ny;
      let diffs = zc.split("").map((d, i) => {
        let v = z[i];
        // if (i === 45 - 9) {
        //   v = z[45 - k];
        // }
        // if (i === 45 - k) {
        //   v = z[45 - 9];
        // }
        return d === v ? 0 : 1;
      });
      // if (z.slice(-10) !== zc.slice(-10)) {
      res.push(diffs.slice(0));
      // res.push(zc);
      // res.push("");
      // if (res.length >= 100) break;
      // }

      // let np = Number(
      //   (BigInt(nx + ny) ^ BigInt(nz)) & BigInt(2 ** 46 - 1 - sum([9, 10, 11, 12, 13, 14].map((d) => 2 ** d)))
      // ).toString(2);
      // let res2 = transpose([xs, ys, zs, zs0].map((d) => d.map((d) => d.v)));
      // res = parseInt(zs.map((z) => z.v).join(""), 2);
      // if (exprs.length > 43) {
      //   let e = exprs.at(-1);
      //   e = e.replace(/AND/g, "&&");
      //   e = e.replace(/XOR/g, "^");
      //   e = e.replace(/OR/g, "||");
      //   // e = eval(e);
      //   console.log(e);
      // }
    }
    console.log(res.join("\n"));
    res = null;
  }
  return res;
}

// z09,z10,z13,z14,z21,z22,z39,z40 not

export default function (inputRows) {
  // const mat = inputRows.map((r) => r.split(""));
  // const dict = groupBy(
  //   mat.map((r, i) => r.map((c, j) => ({ x: j, y: i, c }))).flat(),
  //   (d) => d.c,
  //   (d) => d
  // );
  let inputGroups = splitArray(inputRows, (r) => r === "");
  let inits = parseTable(inputGroups[0]);
  let gateRules = inputGroups[1].map((r) => r.split(" "));
  return [calc1(inits, gateRules), calc2(inits, gateRules)];
}

// (r) => r.split(/[-]|: | /g);
// (r) => r.split(" ");
// (r) => r.split(" ").map((d, i) => (i === 0 ? d : Number(d)));
// (r) => r.split(" ").join("");
// (r) => r.split(/ \| /).map((d) => d.split(" "));
// (r) => r.split("").map(Number);
// (r) => r.split(/[,-]/g).map(Number);
