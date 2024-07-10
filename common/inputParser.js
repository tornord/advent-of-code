/* eslint-disable prefer-const  */
/* eslint-disable no-console  */
/* eslint-disable semi  */
/* eslint-disable comma-spacing  */
/* eslint-disable space-infix-ops  */
/* eslint-disable arrow-spacing  */
/* eslint-disable arrow-parens  */
/* eslint-disable quotes  */
/* eslint-disable no-extra-semi  */

const parseTempl = (expr) =>
  expr
    .join("")
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function parseToken(r, idx) {
  const createToken = (type, value, len = null) => ({ type, value, pos: idx, len: len ?? value?.length ?? 0 });
  let c = r[idx];
  let prev = idx > 0 ? r[idx - 1] : "";
  let s = r.slice(idx);
  let mSpace = s.match(/^[ \t]+/);
  if (mSpace) return createToken("spec", " ", mSpace[0].length);
  let mHex = s.match(/^(0[xX]([a-fA-F0-9])+)(?![g-zG-Z])/);
  if (mHex) return createToken("mix", mHex[0]);
  let mXDelimiter = s.match(/^x(?=\d+(?:x\d+)*)(?![a-wyzA-WYZ])/);
  if (/\d/.test(prev) && mXDelimiter) return createToken("spec", "x");
  const specChars = "#,;:=()<>[]%~.^/*$@!?|{}\"'";
  let specReg = new RegExp(`^((?:->|=>)(?=[ \t])|\\.\\.(?=\\d)|[${escapeRegExp(specChars)}]|[-+](?!\\.?\\d))`);
  let mSpec = s.match(specReg);
  if (mSpec) return createToken("spec", mSpec[0]);
  if ((c === "-" || c === "+") && prev.match(/[\\.0-9]/)) return createToken("spec", c);
  let mStr = s.match(/^([a-zA-Z]+)(?![0-9])/);
  if (mStr) return createToken("str", mStr[0]);
  let mFloat = s.match(/^([-+]?(?:[0-9]*\.)?[0-9]+)(?![\\.a-zA-Z])/);
  let mInt = s.match(/^([-+]?[0-9]+)(?![\\.a-zA-Z])/);
  if (mFloat && !mInt) return createToken("float", mFloat[0]);
  if (mInt) return createToken("int", mInt[0]);
  let mIntXDelimited = s.match(/^(\d+)(?=(?:x\d+)+)(?![a-wyzA-WYZ])/);
  if (mIntXDelimited) return createToken("int", mIntXDelimited[0]);
  let mMix = s.match(/^([a-zA-Z0-9]+)/);
  if (mMix) return createToken("mix", mMix[0]);
  return createToken("err", c);
}

export function parseRow(r) {
  r = r.replace(/[\u2013\u2014]/g, "-");
  r = r.replace(/\u00A0/g, " ");
  let mStart = r.match(/^[ \t]+/);
  let indent = 0;
  if (mStart) {
    r = r.slice(mStart[0].length);
    indent = mStart[0].replace(/\t/g, "  ").length;
  }
  let mEnd = r.match(/[ \t]+$/);
  if (mEnd) {
    r = r.slice(0, -mEnd[0].length);
  }
  let tokens = [];
  let idx = 0;
  while (idx < r.length) {
    let t = parseToken(r, idx);
    if (!t) break;
    idx += t.len;
    if (!t.type) continue;
    tokens.push(t);
  }
  tokens = tokens.filter((d, i, a) => {
    if (d.value !== " ") return true;
    let tp = a[i - 1]?.type ?? "spec";
    let tn = a[i + 1]?.type ?? "spec";
    return !(tp === "spec" || tn === "spec");
  });
  return { indent, tokens };
}

export function isArray(t) {
  if (t.type !== "spec") return false;
  return true;
}

// function main() {
//   const rs = parseTempl`
//       ^hello
//       3/4
//       3/5
//       0/1
//       10/1
//       9/10
//     `;
//   const res = rs.map((r) => parseRow(r));
//   console.log(res);
// }

// main();
