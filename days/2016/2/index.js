import { newMatrix } from "../../../common";

const { min, max } = Math;

function runInstructions(input, keypad, x0, y0) {
  const ny = keypad.length;
  const nx = keypad[0].length;
  let x = x0;
  let y = y0;
  const code = [];
  for (let i = 0; i < input.length; i++) {
    for (const r of input[i]) {
      let y1 = y;
      let x1 = x;
      if (r === "U") y1 = max(0, y - 1);
      if (r === "D") y1 = min(ny - 1, y + 1);
      if (r === "L") x1 = max(0, x - 1);
      if (r === "R") x1 = min(nx - 1, x + 1);
      if (keypad[y1][x1] !== " ") {
        x = x1;
        y = y1;
      }
    }
    code.push(keypad[y][x]);
  }
  return code.join("");
}

function calc1(input) {
  const keypad = newMatrix(3, 3, (r, c) => 3 * r + c + 1);
  return runInstructions(input, keypad, 1, 1);
}

function calc2(input) {
  const keypad = ["  1  ", " 234 ", "56789", " ABC ", "  D  "].map((d) => d.split(""));
  return runInstructions(input, keypad, 0, 2);
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(""));
  return [calc1(input), calc2(input)];
}
