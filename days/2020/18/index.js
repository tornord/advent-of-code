import { strict as assert } from "node:assert";

import { sum } from "../../../common";

function trim(expr, idx, c = " ") {
  while (idx < expr.length && expr[idx] === c) {
    idx++;
  }
  return idx;
}

function trimSpace(expr) {
  return expr.replace(/\s/g, "");
}

// Clumpsy method that tries to tokenize, parse and evaluate all at once
// Uses the idea of recurtion
// eval(5 + 3 * 4) -> 5 + eval(3 * 4) -> 5 + 3 * 4
function evalMath(expr, idx = 0, val = null, op = null, prec = null, part = 1) {
  idx = trim(expr, idx);
  let vStart = 0;
  if (part === 2 && !prec && op === "*") {
    const res = evalMath(expr, idx, null, null, part === 2 ? "+" : null, part);
    vStart = res.val;
    idx = res.idx;
    idx = trim(expr, idx);
  } else if (expr[idx] === "(") {
    idx = trim(expr, idx + 1);
    const res = evalMath(expr, idx, null, null, null, part);
    vStart = res.val;
    idx = res.idx;
    idx = trim(expr, idx);
  } else if (/\d/.test(expr[idx])) {
    vStart = Number(expr[idx]);
    idx = trim(expr, idx + 1);
  }
  let v = vStart;
  if (op) {
    v = op === "+" ? val + v : val * v;
  }
  if (idx >= expr.length || expr[idx] === ")") {
    idx += !prec && expr[idx] === ")" ? 1 : 0;
    return { val: v, idx };
  }
  const opNext = expr[idx];
  if (prec === "+" && opNext === "*") return { val: v, idx };
  idx = trim(expr, idx + 1);
  return evalMath(expr, idx, v, opNext, prec, part);
}

function evalMath1(expr) {
  return evalMath(trimSpace(expr), 0, null, null, null, 1).val;
}
assert.deepEqual(evalMath1("1"), 1);
assert.deepEqual(evalMath1("1 + 2"), 3);
assert.deepEqual(evalMath1("3 * 4"), 12);
assert.deepEqual(evalMath1("(3 + 4)"), 7);
assert.deepEqual(evalMath1("1 + 3 * 5"), 20);
assert.deepEqual(evalMath1("1 + 2 * 3 + 4 * 5 + 6"), 71);
assert.deepEqual(evalMath1("1 + (2 * 3) + (4 * (5 + 6))"), 51);
assert.deepEqual(evalMath1("2 * 3 + (4 * 5)"), 26);
assert.deepEqual(evalMath1("5 + (8 * 3 + 9 + 3 * 4 * 3)"), 437);
assert.deepEqual(evalMath1("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"), 12240);
assert.deepEqual(evalMath1("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2"), 13632);
assert.deepEqual(evalMath1("9 + (8 * 5 * 5 * 4 * (3 * 5) * 2) + 4 + 4"), 24017);
assert.deepEqual(evalMath1("5 + 5 + 2 * 4 + 4"), 52);
assert.deepEqual(evalMath1("(1 + (2*3)) + (5*3)"), 22);
assert.deepEqual(evalMath1("6 * 9 + 5 + 5 + 2 * (4 + 4 + 2 * 6 + 3 + 9)"), 4752);
assert.deepEqual(evalMath1("((3 * 5 * 2 * 8 * 5) + 2 * (4 + 9 + 5 * 9 * 8) + (2 + 6 * 6 * 5 + 3 + 9))"), 1558044);
assert.deepEqual(evalMath1("((9) + 2 * (4 + 4 + 2 * 6 + 3 + 9)) * (7) * (2 + 9 * 9) + 2 * 6"), 3293148);
assert.deepEqual(evalMath1("5 + 6 * 7 * (2 + 9 * 9) + 2 * 6"), 45750);
assert.deepEqual(evalMath1("5 + (1 + (3 * 4))"), 18);
assert.deepEqual(evalMath1("5 + ((1 + 3)) * 2"), 18);
assert.deepEqual(evalMath1("5 + (1 + (3 * 4)) * 2"), 36);

function evalMath2(expr) {
  return evalMath(trimSpace(expr), 0, null, null, null, 2).val;
}
assert.deepEqual(evalMath2("3 * 1 + 2"), 9);
assert.deepEqual(evalMath2("1 + 2 * 3 + 4 * 5 + 6"), 231);
assert.deepEqual(evalMath2("1 + (2 * 3) + (4 * (5 + 6))"), 51);
assert.deepEqual(evalMath2("2 * 3 + (4 * 5)"), 46);
assert.deepEqual(evalMath2("5 + (8 * 3 + 9 + 3 * 4 * 3)"), 1445);
assert.deepEqual(evalMath2("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))"), 669060);
assert.deepEqual(evalMath2("(6 + 3) + 5 + (4 * 6 + 8) * 6"), 420);
assert.deepEqual(evalMath2("(2 + 4 * 9) * (6 + 9 * 8 + 6) + 6"), 11664);

// Much better method that tokenizes, parses and evaluates separately
// (and in part 2, changes the precedence of addition as a middle step)
function tokenize(expr) {
  return expr.split("").filter((c) => c !== " ");
}
assert.deepEqual(tokenize("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2").join(""), "((2+4*9)*(6+9*8+6)+6)+2+4*2");

function parseExprTree(tokens, idx = 0) {
  const res = [];
  while (idx < tokens.length) {
    const c = tokens[idx];
    if (c === "(") {
      const [sub, i] = parseExprTree(tokens, idx + 1);
      res.push(sub);
      idx = i;
    } else if (c === ")") {
      return [res, idx + 1];
    } else {
      res.push(c);
      idx++;
    }
  }
  return [res, tokens.length];
}
assert.deepEqual(parseExprTree(tokenize("1 + (3 * 4 + 5) * 2"))[0], ["1", "+", ["3", "*", "4", "+", "5"], "*", "2"]);

function changeAddPrecedence(expr) {
  if (!Array.isArray(expr)) return expr;
  const res = [];
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === "+") {
      res.push([res.pop(), "+", changeAddPrecedence(expr[i + 1])]);
      i++;
    } else {
      res.push(changeAddPrecedence(c));
    }
  }
  return res;
}
assert.deepEqual(changeAddPrecedence(["1", "+", ["3", "*", "4", "+", "5"], "*", "2"]), [["1", "+", ["3", "*", ["4", "+", "5"]]], "*", "2"]); // prettier-ignore

function evalExpr(expr) {
  if (!Array.isArray(expr)) return Number(expr);
  if (expr.length === 1) return evalExpr(expr[0]);
  const op = expr.at(-2);
  const a = evalExpr(expr.slice(0, -2));
  const b = evalExpr(expr.at(-1));
  return op === "+" ? a + b : a * b;
}
assert.deepEqual(evalExpr(parseExprTree(tokenize("1 + (3 * 4 + 5) * 2"))[0]), 36); // prettier-ignore
assert.deepEqual(evalExpr(parseExprTree(tokenize("((3 * 5 * 2 * 8 * 5) + 2 * (4 + 9 + 5 * 9 * 8) + (2 + 6 * 6 * 5 + 3 + 9))"))[0]), 1558044); // prettier-ignore

function calc1(input) {
  const e = (d) => evalExpr(parseExprTree(tokenize(d))[0]);
  return sum(input.map(e));
  // return sum(input.map(evalMath1));
}

function calc2(input) {
  const e = (d) => evalExpr(changeAddPrecedence(parseExprTree(tokenize(d))[0]));
  return sum(input.map(e));
  // return sum(input.map(evalMath2));
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
