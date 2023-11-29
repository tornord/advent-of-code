function calc1(input) {
  const ny = input.length;
  let s = 0;
  for (let y = 0; y < ny; y++) {
    if (input[y] === input[(y + 1) % ny]) {
      s += Number(input[y]);
    }
  }
  return s;
}

function calc2(input) {
  const ny = input.length;
  let s = 0;
  for (let y = 0; y < ny; y++) {
    if (input[y] === input[(y + ny / 2) % ny]) {
      s += Number(input[y]);
    }
  }
  return s;
}

export default function (inputRows) {
  const input = inputRows[0];
  return [calc1(input), calc2(input)];
}

