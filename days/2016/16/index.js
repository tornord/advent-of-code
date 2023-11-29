function calc1(input, disksize) {
  let a = input[0];
  while (a.length < disksize) {
    let b = a.slice();
    b.reverse();
    b = b.map((d) => 1 - d);
    a = [...a, 0, ...b];
  }
  a = a.slice(0, disksize);
  let checksum = a.slice();
  while (checksum.length % 2 === 0) {
    const cs = [];
    for (let i = 0; i < checksum.length / 2; i++) {
      const c0 = checksum[2 * i];
      const c1 = checksum[2 * i + 1];
      cs.push(c0 === c1 ? 1 : 0);
    }
    checksum = cs;
  }
  return checksum.join("");
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split("").map(Number));
  const disksize1 = input[0].length === 5 ? 20 : 272;
  const disksize2 = input[0].length === 5 ? 20 : 35651584;
  return [calc1(input, disksize1), calc1(input, disksize2)];
}
