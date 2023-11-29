import { newArray, prod, sum } from "../../../common";

const { min, max } = Math;

const hexToBin = newArray(16, (i) => i)
  .map((_, i) => i)
  .map((d) => [d.toString(16).toUpperCase(), d.toString(2).padStart(4, "0")])
  .reduce((p, [k, v]) => {
    p[k] = v;
    return p;
  }, {});

const parseHeader = (c) => {
  const version = parseInt(c.slice(0, 3), 2);
  const type = parseInt(c.slice(3, 6), 2);
  const lengthType = type === 4 ? null : parseInt(c.slice(6, 7));
  return { version, type, lengthType };
};

const mod8 = (s) => (s % 8 === 0 ? 0 : 8 - (s % 8));

function parseMessage(code, isSub = false) {
  const p = parseHeader(code);
  let length = null;
  let value = null;
  let subPackets = null;
  if (p.type === 4) {
    let i = 6;
    value = "";
    while (i > 0) {
      const v = code.slice(i + 1, i + 5);
      value = value + v;
      if (code[i] === "0") {
        break;
      }
      i += 5;
    }
    const s = i + 5;
    length = s + (isSub ? 0 : mod8(s));
  } else {
    let t = 7;
    subPackets = [];
    if (p.lengthType === 0) {
      const s = parseInt(code.slice(7, 22), 2);
      t += 15 + s;
      let codesub = code.slice(22, 22 + s);
      while (codesub.length > 0) {
        const m = parseMessage(codesub, true);
        subPackets.push(m);
        codesub = codesub.slice(m.length);
        length += m.length;
      }
    } else {
      // lengthType 1
      const nSubPackets = parseInt(code.slice(7, 18), 2);
      t += 11;
      let codesub = code.slice(18);
      for (let i = 0; i < nSubPackets; i++) {
        const m = parseMessage(codesub, true);
        subPackets.push(m);
        codesub = codesub.slice(m.length);
        t += m.length;
      }
    }
    length = t + (isSub ? 0 : mod8(t));
  }
  return { ...p, length, value, subPackets };
}

function versionSum(m) {
  return m.version + (m.type !== 4 ? sum(m.subPackets.map((d) => versionSum(d))) : 0);
}

function calcValue(m) {
  if (m.type === 4) {
    return parseInt(m.value, 2);
  }
  const xs = m.subPackets.map((d) => calcValue(d));
  if (m.type === 0) {
    return sum(xs);
  }
  if (m.type === 1) {
    return prod(xs);
  }
  if (m.type === 2) {
    return min(...xs);
  }
  if (m.type === 3) {
    return max(...xs);
  }
  // 5,6,7
  if (m.type === 5) {
    return xs[0] > xs[1] ? 1 : 0;
  }
  if (m.type === 6) {
    return xs[0] < xs[1] ? 1 : 0;
  }
  if (m.type === 7) {
    return xs[0] === xs[1] ? 1 : 0;
  }
  return 0;
}

function toBin(h) {
  return h
    .split("")
    .map((d) => hexToBin[d])
    .join("");
}

function calc1(rows) {
  const versions = [];
  for (let i = 0; i < rows.length; i++) {
    let hexcode = toBin(rows[i]);
    const messages = [];
    while (hexcode.length > 0) {
      const m = parseMessage(hexcode);
      messages.push(m);
      hexcode = hexcode.slice(m.length);
    }
    const v = sum(messages.map((d) => versionSum(d)));
    versions.push(v);
  }
  return versions;
}

function calc2(rows) {
  const values = [];
  for (let i = 0; i < rows.length; i++) {
    let hexcode = toBin(rows[i]);
    const messages = [];
    while (hexcode.length > 0) {
      const m = parseMessage(hexcode);
      messages.push(m);
      hexcode = hexcode.slice(m.length);
      const v = calcValue(m);
      values.push(v);
    }
  }
  return values;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
