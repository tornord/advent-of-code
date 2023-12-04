import { newArray, transpose } from "./helpers";

const { max } = Math;

function groupBy(xs, keyFun = (d) => d) {
  const dict = Object.assign({}, ...xs.map((d, i) => ({ [keyFun(d, i)]: [] })));
  xs.forEach((d, i) => dict[keyFun(d, i)].push(d));
  return dict;
}
const isNumeric = (str) => (typeof str === "string" ? !isNaN(str) && !isNaN(parseFloat(str)) : false);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function parseTable(rows, charactersToNotSplitOn = "") {
  const charactersToSplitOn = "#,;:=()<>[]";
  const regexCharacters = escapeRegExp(
    charactersToSplitOn
      .split("")
      .filter((char) => charactersToNotSplitOn.indexOf(char) === -1)
      .join("")
  );
  const regex = new RegExp(`[${regexCharacters}][ \\t]*|(?<=\\d)-|[.-](?![ \\d])|[ \\t]+|(?<=[a-zA-Z])(?=\\d)`);
  const res = rows.map((r) => r.split(regex));
  const nr = max(...res.map((r) => r.length));
  let vals = [...Array(nr)].map((d, i) => res.map((r) => r?.[i] ?? null));
  const nums = vals.map((vs) => vs.every((d) => d === null || isNumeric(d)));
  const monos = vals.map((vs) => {
    vs = vs.map((d) => (d === "" ? null : d));
    const zs = vs.filter((d) => d !== null);
    if (zs.length === 0) return true;
    const hasNull = zs.length < vs.length;
    const gs = groupBy(zs);
    const n = Object.values(gs).length;
    if (n === 1 && !hasNull) return true;
    if (n > 2 || (n === 2 && hasNull)) return false;
    const ks = Object.keys(gs).map((k) => k.replace(/s$/, ""));
    return ks[0] === ks[1];
  });
  vals = vals.filter((d, i) => !monos[i] || nums[i]);
  vals = vals.map((vs) => {
    if (vs.every((d) => d === null || (!(d.length > 1 && d[0] === "0") && isNumeric(d)))) {
      return vs.map((d) => (d !== null ? Number(d) : null));
    }
    return vs;
  });
  if (vals.length === 0) return [];
  return [...Array(vals[0].length)].map((d, i) => vals.map((e) => e[i] ?? null));
}

export function preSplitAndParseTables(rows, colSplitter = /[:]/) {
  const ts = rows.map((r) => r.split(colSplitter));
  const n = Math.max(...ts.map((r) => r.length));
  return transpose(newArray(n, (d) => d).map((i) => parseTable(ts.map((r) => r?.[i] ?? ""))));
}
