import { strict as assert } from "node:assert";

import { prod, splitArray, sum } from "../../../common";

const XMAS = "xmas".split("");

function parseWorkflowRule(r) {
  const c = r.split(":");
  if (c.length === 1) return { target: c[0] };
  let [, key, op, val] = c[0].match(/([a-z])([<>=]+)([0-9]+)/);
  val = Number(val);
  return { key, op, val, target: c[1] };
}
assert.deepEqual(parseWorkflowRule("A"), { target: "A" }); // prettier-ignore
assert.deepEqual(parseWorkflowRule("m>2090:A"), { key: "m", op: ">", val: 2090, target: "A" }); // prettier-ignore

function applyRule1(wfs, r, p) {
  const { key, op, val, target } = parseWorkflowRule(r);
  if (!key) {
    if (r === "A") return "A";
    if (r === "R") return "R";
    const wf = wfs[target];
    if (wf) {
      return applyWf1(wfs, wf, p) ? "A" : "R";
    }
    return target;
  }

  if (op === "<") {
    if (p[key] < val) {
      const wf = wfs[target];
      if (wf) return applyWf1(wfs, wf, p) ? "A" : "R";
      return target;
    }
    return null;
  }
  if (op === ">") {
    if (p[key] > val) {
      const wf = wfs[target];
      if (wf) return applyWf1(wfs, wf, p) ? "A" : "R";
      return target;
    }
    return null;
  }
  if (p[key] === val) {
    const wf = wfs[target];
    if (wf) return applyWf1(wfs, wf, p) ? "A" : "R";
    return target;
  }
  return null;
}

function applyWf1(wfs, wf, p) {
  for (const r of wf.rs) {
    const x = applyRule1(wfs, r, p);
    if (x !== null) return x === "A";
  }
  return false;
}

function calc1(wfs, parts) {
  // let res2 = 0;
  // for (const p of parts) {
  //   const c = createCube(XMAS, 0, 0);
  //   for (const k of XMAS) {
  //     c[k] = [p[k], p[k]];
  //   }
  //   const r = { A: [], R: [], U: [c] };
  //   applyWf2(wfs, wfs["in"], r); // eslint-disable-line dot-notation
  //   if (r.A.length === 1) {
  //     res2 += p.x + p.m + p.a + p.s;
  //   }
  // }
  // return res2;
  const wf = wfs["in"]; // eslint-disable-line dot-notation
  const res = parts.filter((d) => applyWf1(wfs, wf, d));
  return sum(res.map((d) => d.x + d.m + d.a + d.s));
}

function copyCube(c) {
  return Object.fromEntries(Object.entries(c).map(([k, v]) => [k, [...v]]));
}
assert.deepEqual(copyCube({ x: [1, 4], y: [2, 3] }), { x: [1, 4], y: [2, 3] });

function createCube(props, mn, mx) {
  return Object.fromEntries(props.map((k) => [k, [mn, mx]]));
}

function cutInterval(r, op, val) {
  const [lo, hi] = r;
  const rs = [];
  if (op === "<") {
    if (val <= lo) return [null, r];
    if (val > hi) return [r];
    rs.push([lo, val - 1], [val, hi]);
  }
  if (op === ">") {
    if (val >= hi) return [null, r];
    if (val < lo) return [r];
    rs.push([val + 1, hi], [lo, val]);
  }
  return rs;
}

// [true, ...falses]
function cutCube(c, key, op, val) {
  if (!(key in c)) return [c];
  const rs = cutInterval(c[key], op, val);
  return rs.map((d) => {
    if (!d) return null;
    const r = copyCube(c);
    r[key] = d;
    return r;
  });
}

// [selected, rejecteds]
function applyCrits(c, crits) {
  if (crits.length === 0) return [c, []];
  const res = [];
  for (const cr of crits) {
    const [matched, ...rejecteds] = cutCube(c, cr.key, cr.op, cr.val);
    if (rejecteds.length > 0) {
      res.push(...rejecteds);
    }
    if (matched === null) {
      return [null, res];
    }
    c = matched;
  }
  return [c, res];
}

function applyValue(p, resType, crits) {
  const sels = [];
  const rejs = [];
  for (let i = 0; i < p.U.length; i++) {
    const c = p.U[i];
    const [c1, res1] = applyCrits(c, crits);
    if (c1 !== null) {
      sels.push(c1);
    }
    if (res1.length === 0) continue;
    rejs.push(...res1);
  }
  p.U = rejs;
  p[resType].push(...sels);
}

function applyRule2(wfs, r, p, crits) {
  const { key, op, val, target } = parseWorkflowRule(r);
  if (!key) {
    if (r === "A") {
      applyValue(p, "A", crits);
    } else if (r === "R") {
      applyValue(p, "R", crits);
    } else {
      const wf = wfs[target];
      if (wf) {
        applyWf2(wfs, wf, p, crits);
      } else {
        applyValue(p, target, crits);
      }
    }
    return;
  }

  const cs = crits.slice();
  cs.push({ key, op, val });

  const wf = wfs[target];
  if (wf) {
    applyWf2(wfs, wf, p, cs);
  } else {
    applyValue(p, target, cs);
  }
}

function applyWf2(wfs, wf, p, crits = []) {
  for (let j = 0; j < wf.rs.length; j++) {
    const r = wf.rs[j];
    applyRule2(wfs, r, p, crits);
    if (p.U.length === 0) return;
  }
}
const TEST_P = { A: [], R: [], U: [{ x: [1, 4] }] };
const TEST_WF = { n: "xx", rs: ["x>2:A", "x>1:A", "R"] };
applyWf2({}, TEST_WF, TEST_P);
assert.deepEqual(TEST_P, {"A": [{"x": [ 3, 4]}, {"x": [2, 2]}], "R": [{"x": [1, 1]}], "U": []}); // prettier-ignore

function calc2(wfs) {
  const wf = wfs["in"]; // eslint-disable-line dot-notation
  const N = 4000;
  const p = { A: [], R: [], U: [createCube(XMAS, 1, N)] };

  applyWf2(wfs, wf, p);
  const cs = p.A;
  const res = [];
  for (const c of cs) {
    const vs = XMAS.map((k) => c[k]).map(([a, b]) => b - a + 1);
    res.push(prod(vs));
  }
  return sum(res);
}

function parseWorkflows(input) {
  const res = {};
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    let [, n, rs] = r.match(/([a-z]+)\{(.+)\}/);
    rs = rs.split(",");
    res[n] = { n, rs };
  }
  return res;
}

function parsePart(r) {
  return Object.fromEntries(
    r
      .slice(1, -1)
      .split(/,/g)
      .map((d) => {
        const [x, y] = d.split("=");
        return [x, Number(y)];
      })
  );
}

export default function (inputRows) {
  const [wfsIn, partsIn] = splitArray(inputRows, (r) => r === "");
  const wfs = parseWorkflows(wfsIn);
  const parts = partsIn.map((d) => parsePart(d));
  return [calc1(wfs, parts), calc2(wfs)];
}
