import { isNumeric } from "../../../common";

const getValue = (vals, a) => {
  if (isNumeric(a)) {
    return Number(a);
  }
  return vals[a] ?? 0;
};

const setValue = (vals, c, v) => {
  const mx = 65535;
  vals[c] = v & mx;
};

const gates = {
  not: (a) => ~a,
  lshift: (a, b) => a << b,
  rshift: (a, b) => a >> b,
  or: (a, b) => a | b,
  and: (a, b) => a & b,
  assign: (a) => a,
};

const evalOperation = (op, vals) => {
  const a = getValue(vals, op.a);
  const b = op.b !== null ? getValue(vals, op.b) : null;
  const fn = gates[op.name];
  const v = fn(a, b);
  setValue(vals, op.c, v);
  op.evaluated = true;
};

const newOperation = (name, a, b, c) => {
  const dependents = [a, b].filter((d) => d !== null && !isNumeric(d));
  return { name, a, b, c, dependents, evaluated: false };
};

function calc(rows, replaceOperation) {
  const ny = rows.length;
  const ops = {};
  for (let y = 0; y < ny; y++) {
    const r = rows[y];
    let op;
    if (r[0] === "not") {
      op = newOperation(r[0], r[1], null, r[3]);
    } else if (["lshift", "rshift", "or", "and"].findIndex((d) => d === r[1]) >= 0) {
      op = newOperation(r[1], r[0], r[2], r[4]);
    } else {
      op = newOperation("assign", r[0], null, r[2]);
    }
    ops[op.c] = op;
  }
  if (replaceOperation !== null) {
    ops[replaceOperation.c] = replaceOperation;
  }
  let queue = [...Object.values(ops)];
  let n = 0;
  const vals = {};
  while (queue.length > 0 && n++ < 100000) {
    for (const op of queue) {
      if (!op.dependents.every((d) => d in vals)) continue;
      evalOperation(op, vals);
    }
    queue = queue.filter((d) => !d.evaluated);
  }
  // eslint-disable-next-line dot-notation
  return vals["a"];
}

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split(/ | -> /g).map((d) => d.toLowerCase()));
  const a1 = calc(rows, null);
  const a2 = calc(rows, newOperation("assign", String(a1), null, "b"));
  return [a1, a2];
}
