const { max, floor, sqrt } = Math;

function calcTrajectory(dx, dy, area) {
  const [x1, x2, y1, y2] = area;
  let [x, y, yMax] = [0, 0, 0];
  while (x <= x2 && y >= y1) {
    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return [true, yMax];
    x += dx;
    y += dy;
    if (y > yMax) {
      yMax = y;
    }
    dx = max(dx - 1, 0);
    dy--;
  }
  return [false, -1];
}

function calc1(input) {
  const [, , y1] = input;
  return (y1 * (y1 + 1)) / 2;
}

function calc2(input) {
  const [x1, x2, y1] = input;
  const minDx = floor(0.5 + sqrt(0.25 + (2 * x1 - 2)));
  const maxDx = x2;
  const minDy = y1;
  const maxDy = -y1 - 1;
  const initSpeeds = [];
  for (let dy = minDy; dy <= maxDy; dy++) {
    for (let dx = minDx; dx <= maxDx; dx++) {
      const r = calcTrajectory(dx, dy, input);
      if (r[0]) {
        initSpeeds.push(`${dx},${dy}`);
      }
    }
  }
  return initSpeeds.length;
}

export default function (inputRows) {
  let input = inputRows.map((r) => r.split(/=|\.{2}|,/g));
  input = [1, 2, 4, 5].map((d) => input[0][d]).map(Number);
  return [calc1(input), calc2(input)];
}
