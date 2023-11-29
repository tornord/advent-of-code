export default function (inputRows) {
  let x = 0;
  let y1 = 0;
  let y2 = 0;
  let z = 0;
  for (const r of inputRows) {
    const m = r.match(/(forward|down|up) (\d+)/);
    const [c, n] = m.slice(1);
    const nn = Number(n);
    if (c[0] === "f") {
      x += nn;
      y2 += z * nn;
    }
    if (c[0] === "u") {
      y1 -= nn;
      z -= nn;
    }
    if (c[0] === "d") {
      y1 += nn;
      z += nn;
    }
  }
  return [x * y1, x * y2];
}
