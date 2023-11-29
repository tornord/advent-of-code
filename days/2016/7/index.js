function isAbba(s) {
  for (let i = 0; i < s.length - 3; i++) {
    if (s[i] === s[i + 3] && s[i + 1] === s[i + 2] && s[i] !== s[i + 1]) return true;
  }
  return false;
}

function abas(s) {
  const res = [];
  for (let i = 0; i < s.length - 2; i++) {
    if (s[i] === s[i + 2] && s[i] !== s[i + 1]) res.push(s.slice(i, i + 3));
  }
  return res;
}

function calc1(input) {
  const ny = input.length;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    let abbaOutside = false;
    let abbaInside = false;
    for (let j = 0; j < r.length; j++) {
      const a = isAbba(r[j]);
      if (j % 2 === 0 && a) {
        abbaOutside = true;
      }
      if (j % 2 === 1 && a) {
        abbaInside = true;
      }
    }
    n += abbaOutside && !abbaInside ? 1 : 0;
  }
  return n;
}

function flipAba(s) {
  return [1, 0, 1].map((d) => s[d]).join("");
}

function calc2(input) {
  const ny = input.length;
  let n = 0;
  for (let y = 0; y < ny; y++) {
    const r = input[y];
    const abaOutside = new Set();
    let m = false;
    for (let j = 0; j < r.length; j += 2) {
      const a = abas(r[j]);
      a.forEach((d) => abaOutside.add(d));
    }
    for (let j = 1; j < r.length; j += 2) {
      const a = abas(r[j]);
      if (a.map(flipAba).some((d) => abaOutside.has(d))) {
        m = true;
      }
    }
    n += m ? 1 : 0;
  }
  return n;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/[[\]]/g));
  return [calc1(input), calc2(input)];
}
