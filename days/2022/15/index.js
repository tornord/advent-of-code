const { abs, cos, min, max, PI, round, sin, sqrt } = Math;

function dist(p0, p1) {
  return abs(p0.x - p1.x) + abs(p0.y - p1.y);
}

function calcScanLineCoverage(rows, scanY) {
  const res = [];
  for (let y = 0; y < rows.length; y++) {
    const [sensor, beacon] = rows[y];
    const distToBeacon = dist(sensor, beacon);
    const distToScanLine = dist(sensor, { x: sensor.x, y: scanY });
    if (distToBeacon < distToScanLine) continue;
    // calc min&max where the sensor/beacon cover the scan line
    const coverMin = sensor.x - (distToBeacon - distToScanLine);
    const coverMax = sensor.x + (distToBeacon - distToScanLine);
    res.push({ beacon, coverMin, coverMax });
  }
  return res;
}

function calc1(rows, scanY) {
  const covers = calcScanLineCoverage(rows, scanY);
  const scanMin = min(...covers.map((d) => d.coverMin));
  const scanMax = max(...covers.map((d) => d.coverMax));
  let n = 0;
  for (let x = scanMin; x <= scanMax; x++) {
    const distToBeacon = covers.map((d) => dist(d.beacon, { x, y: scanY }));
    if (min(...distToBeacon) === 0) {
      continue;
    }
    const sensorCovers = covers.map((d) => {
      return x >= d.coverMin && x <= d.coverMax;
    });
    if (sensorCovers.some((d) => d === true)) {
      n++;
      continue;
    }
  }
  return n;
}

// eslint-disable-next-line
function calc2(rows, ymax) {
  // let s = rows.map(r=>[r[0].x,r[0].y,r[1].x,r[1].y].join("\t")).join("\n")
  // clipboardy.writeSync(JSON.stringify(rows.map((r) => ({ sensor: r[0], beacon: r[1] }))));
  let freq = 0;
  for (let y = 0; y <= ymax; y++) {
    const covers = calcScanLineCoverage(rows, y);
    if (covers.length === 0) continue;
    const leftCovers = covers.slice();
    leftCovers.sort((d1, d2) => d1.coverMin - d2.coverMin);
    const rightCovers = covers.slice();
    rightCovers.sort((d1, d2) => d2.coverMax - d1.coverMax);
    let leftmax = leftCovers[0].coverMax;
    for (let i = 1; i < leftCovers.length; i++) {
      const c = leftCovers[i];
      if (c.coverMin > leftmax + 1) {
        continue;
      }
      if (c.coverMax > leftmax) leftmax = c.coverMax;
    }
    let rightmin = rightCovers[0].coverMin;
    for (let i = 1; i < rightCovers.length; i++) {
      const c = rightCovers[i];
      if (c.coverMax < rightmin - 1) {
        continue;
      }
      if (c.coverMin < rightmin) rightmin = c.coverMin;
    }
    if (leftmax === rightmin - 2) {
      const by = y;
      const bx = (leftmax + rightmin) / 2;
      freq = 4_000_000 * bx + by;
      break;
    }
  }
  return freq;
}

const phi = 45;

const transform = (p, v) => {
  const sn = sin((v / 180) * PI);
  const cs = cos((v / 180) * PI);
  return { x: cs * p.x + sn * p.y, y: -sn * p.x + cs * p.y };
  // const c = 1 / sqrt(2);
  // return { x: c * (p.x + p.y), y: c * (-p.x + p.y) };
};

function dist45(p0, p1) {
  return max(abs(p0.x - p1.x), abs(p0.y - p1.y));
}

function calc2v2(rows) {
  const data = rows.map((d) => ({ sensor: transform(d[0], phi), beacon: transform(d[1], phi) }));

  const xs = {};
  const ys = {};
  for (let i = 0; i < data.length; i++) {
    const d1 = data[i];
    const h1 = dist45(d1.sensor, d1.beacon);
    for (let j = i + 1; j < data.length; j++) {
      const d2 = data[j];
      const h2 = dist45(d2.sensor, d2.beacon);
      if (
        (d1.sensor.y - h1 < d2.sensor.y - h2 && d1.sensor.y + h1 > d2.sensor.y - h2) ||
        (d1.sensor.y - h1 < d2.sensor.y + h2 && d1.sensor.y + h1 > d2.sensor.y + h2)
      ) {
        if (round((abs(d2.sensor.x - d1.sensor.x) - h1 - h2) * sqrt(2)) === 2) {
          let xa;
          if (d1.sensor.x < d2.sensor.x) {
            xa = (d1.sensor.x + h1 + d2.sensor.x - h2) / 2;
          } else {
            xa = (d2.sensor.x + h2 + d1.sensor.x - h1) / 2;
          }
          xs[round(xa * sqrt(2))] = true;
        }
      }
      if (
        (d1.sensor.x - h1 < d2.sensor.x - h2 && d1.sensor.x + h1 > d2.sensor.x - h2) ||
        (d1.sensor.x - h1 < d2.sensor.x + h2 && d1.sensor.x + h1 > d2.sensor.x + h2)
      ) {
        if (round((abs(d2.sensor.y - d1.sensor.y) - h1 - h2) * sqrt(2)) === 2) {
          let ya;
          if (d1.sensor.y < d2.sensor.y) {
            ya = (d1.sensor.y + h1 + d2.sensor.y - h2) / 2;
          } else {
            ya = (d2.sensor.y + h2 + d1.sensor.y - h1) / 2;
          }
          ys[round(ya * sqrt(2))] = true;
        }
      }
    }
  }

  for (const x of Object.keys(xs).map((d) => Number(d) / sqrt(2))) {
    for (const y of Object.keys(ys).map((d) => Number(d) / sqrt(2))) {
      const frees = data.map((d) => max(abs(d.sensor.x - x), abs(d.sensor.y - y)) > dist45(d.sensor, d.beacon));
      if (frees.every((d) => d)) {
        const p = transform({ x, y }, -phi);
        return 4_000_000 * round(p.x) + round(p.y);
      }
    }
  }
  return null;
}

export default function (inputRows) {
  const rows = inputRows.map((r) =>
    r
      .replace("Sensor at ", "")
      .split(": closest beacon is at ")
      .map((d) => d.replace(/[xy]=/g, "").split(", ").map(Number))
      .map((d) => ({ x: d[0], y: d[1] }))
  );
  const bigVals = max(...[...rows.map((d) => d[0].y), ...rows.map((d) => d[1].y)]) > 1_000_000;
  const y0 = bigVals ? 2_000_000 : 10;
  // const ymax = bigVals ? 4_000_000 : 20;
  return [calc1(rows, y0), calc2v2(rows)]; // calc2(rows, ymax)];
}
