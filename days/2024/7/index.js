const { floor, log10 } = Math;

function concat(a, b) {
  const db = floor(log10(b)) + 1;
  return a * 10 ** db + b;
}

function calc(input, partTwo = true) {
  const ny = input.length;
  let res = 0;
  for (let y = 0; y < ny; y++) {
    const row = input[y];
    const val = row[0];
    const ops = row.slice(1);
    let rs = [ops[0]];
    for (let i = 1; i < ops.length; i++) {
      const rsa = rs.map((r) => r + ops[i]);
      const rsb = rs.map((r) => r * ops[i]);
      let rsc = [];
      if (partTwo) {
        rsc = rs.map((r) => concat(r, ops[i]));
      }
      rs = [...rsa, ...rsb, ...rsc];
    }
    const n = rs.filter((r) => r === val).length;
    if (n > 0) {
      res += val;
    }
  }
  return res;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/:? /g).map(Number));
  return [calc(input, false), calc(input, true)];
}
