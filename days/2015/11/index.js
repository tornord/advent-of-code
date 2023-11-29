function valid(rs) {
  let threeInARow = false;
  for (let i = 0; i < rs.length - 2; i++) {
    if (rs[i] + 1 === rs[i + 1] && rs[i + 1] + 1 === rs[i + 2]) {
      threeInARow = true;
      break;
    }
  }
  let forbiddenLetters = false;
  for (let i = 0; i < rs.length; i++) {
    const c = rs[i];
    if (c === 8 || c === 11 || c === 14) {
      forbiddenLetters = true;
      break;
    }
  }
  let firstPair = null;
  for (let i = 0; i < rs.length - 1; i++) {
    if (rs[i] === rs[i + 1]) {
      firstPair = rs[i];
      break;
    }
  }
  let secondPair = null;
  for (let i = 0; i < rs.length - 1; i++) {
    if (rs[i] === rs[i + 1] && rs[i] !== firstPair) {
      secondPair = rs[i];
      break;
    }
  }
  return threeInARow && !forbiddenLetters && firstPair !== null && secondPair !== null;
}

function inc(rs) {
  rs[rs.length - 1]++;
  for (let i = rs.length - 1; i >= 1; i--) {
    if (rs[i] > 25) {
      rs[i - 1]++;
      rs[i] = 0;
    }
  }
}

function calcNext(c) {
  const rs = codeToArray(c);
  while (!valid(rs)) {
    inc(rs);
  }
  return arrayToCode(rs);
}

function codeToArray(c) {
  return c.split("").map((d) => d.charCodeAt(0) - 97);
}

function arrayToCode(rs) {
  return rs.map((d) => String.fromCharCode(d + 97)).join("");
}

export default function (inputRows) {
  const c1 = calcNext(inputRows[0]);
  const rs = codeToArray(c1);
  inc(rs);
  const c2 = calcNext(arrayToCode(rs));
  return [c1, c2];
}
