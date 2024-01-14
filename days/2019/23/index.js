import { Intcode } from "../intcode";
import { newArray } from "../../../common";

function calc1(prog) {
  const N = 50;
  const prgs = newArray(N, (d) => {
    const res = new Intcode(prog);
    res.id = d;
    res.pausOnInput = true;
    res.run([d]);
    return res;
  });
  const outputs = newArray(N, () => []);
  const n = 1;
  while (n < 10_000) {
    for (let i = 0; i < N; i++) {
      const p = prgs[i];
      const o = outputs[i];
      if (p.input.length === 0) {
        p.input.push(-1);
      }
      const outs = p.run();
      if (p.input.length === 1) {
        p.input.shift();
      }
      o.push(...outs);
      if (o.length >= 3) {
        const [iMsg, x, y] = o;
        outputs[i] = o.slice(3);
        if (prgs[iMsg]) {
          prgs[iMsg].input.push(x, y);
          // console.log(`${n++}: ${i} => ${x},${y} => ${iMsg}`);
        } else {
          return y;
        }
      }
    }
  }
  return null;
}

function calc2(prog) {
  const N = 50;
  const prgs = newArray(N, (d) => {
    const res = new Intcode(prog);
    res.id = d;
    res.pausOnInput = true;
    res.run([d]);
    return res;
  });
  const outputs = newArray(N, () => []);
  let natX = null;
  let natY = null;
  const natYs = {};
  let n = 1;
  while (n < 10_000) {
    let idle = true;
    for (let i = 0; i < N; i++) {
      const p = prgs[i];
      const o = outputs[i];
      if (p.input.length === 0) {
        p.input.push(-1);
      }
      const outs = p.run();
      if (outs.length > 0) {
        idle = false;
      }
      if (p.input.length === 1) {
        p.input.shift();
      }
      o.push(...outs);
      if (o.length >= 3) {
        const [iMsg, x, y] = o;
        outputs[i] = o.slice(3);
        if (prgs[iMsg]) {
          prgs[iMsg].input.push(x, y);
          // console.log(`${n++}: ${i} => ${x},${y} => ${iMsg}`);
          n++;
        } else {
          natX = x;
          natY = y;
        }
      }
    }
    if (idle) {
      if (natX !== null && natY !== null) {
        if (natYs[natY]) return natY;
        natYs[natY] = true;
        prgs[0].input.push(natX, natY);
        natX = null;
        natY = null;
      }
    }
  }
  return null;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number))[0];
  return [calc1(input), calc2(input)];
}
