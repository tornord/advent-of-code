function countAdjacent(input, y, x, c) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    if (y + dy < 0 || y + dy >= input.length) continue;
    const r = input[y + dy];
    if (!r) continue;
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      if (x + dx < 0 || x + dx >= r.length) continue;
      if (r[x + dx] === c) count++;
    }
  }
  return count;
}

function copyMatrix(m) {
  return m.map((r) => r.slice());
}

function countResult(s) {
  let nTrees = 0;
  let nLumber = 0;
  for (let j = 0; j < s.length; j++) {
    const c = s[j];
    if (c === "|") {
      nTrees++;
    }
    if (c === "#") {
      nLumber++;
    }
  }
  return nTrees * nLumber;
}

const toString = (m) => m.map((r) => r.join("")).join("");

function calc2(input, nMins = 10) {
  const m = copyMatrix(input);
  let m0 = copyMatrix(m);
  let i;
  const dict = {};
  const hist = [toString(m)];
  let s;
  for (i = 1; i <= nMins; i++) {
    const ny = input.length;
    const nx = input?.[0]?.length ?? 0;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const nTrees = countAdjacent(m0, y, x, "|");
        const nLumber = countAdjacent(m0, y, x, "#");
        if (m0[y][x] === ".") {
          if (nTrees >= 3) {
            m[y][x] = "|";
          }
        } else if (m0[y][x] === "|") {
          if (nLumber >= 3) {
            m[y][x] = "#";
          }
        } else if (m0[y][x] === "#") {
          if (nLumber >= 1 && nTrees >= 1) {
            m[y][x] = "#";
          } else {
            m[y][x] = ".";
          }
        }
      }
    }
    s = m.map((r) => r.join("")).join("");
    if (s in dict) {
      const nt = 1_000_000_000;
      const i0 = dict[s];
      const ni = i0 + ((nt - i) % (i - i0));
      s = hist[ni];
      break;
    }
    dict[s] = i;
    hist.push(s);
    m0 = copyMatrix(m);
  }
  return countResult(s);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc2(input), calc2(input, 500)];
}
