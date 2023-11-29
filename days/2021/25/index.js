import { newMatrix } from "../../../common";

function calc(input) {
  const ny = input.length;
  const nx = input?.[0]?.length ?? 0;
  let m0 = input;

  for (let i = 0; i < 100_000; i++) {
    let moving = false;
    let m1 = newMatrix(ny, nx, () => ".");
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        if (m0[y][x] === ">") {
          if (m0[y][(x + 1) % nx] === ".") {
            m1[y][(x + 1) % nx] = ">";
            moving = true;
          } else {
            m1[y][x] = ">";
          }
        }
        if (m0[y][x] === "v") {
          m1[y][x] = "v";
        }
      }
    }

    m0 = m1.map((d) => d.slice());
    m1 = newMatrix(ny, nx, () => ".");
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        if (m0[y][x] === "v") {
          if (m0[(y + 1) % ny][x] === ".") {
            m1[(y + 1) % ny][x] = "v";
            moving = true;
          } else {
            m1[y][x] = "v";
          }
        }
        if (m0[y][x] === ">") {
          m1[y][x] = ">";
        }
      }
    }

    m0 = m1.map((d) => d.slice());
    if (moving === false) return i + 1;
  }
  return -1;
}

export default function (inputRows) {
  return calc(inputRows);
}
