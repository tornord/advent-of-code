const { abs, hypot } = Math;

function arrayFill(i, n, v) {
  const a = [];
  for (; i < n; i++) {
    a.push(v);
  }
  return a;
}

/**
 * Gaussian elimination
 * @param  array A matrix
 * @param  array x vector
 * @return array x solution vector
 */
export function gaussElimination2(A, x) {
  let i, k, j;

  // Just make a single matrix
  for (i = 0; i < A.length; i++) {
    A[i].push(x[i]);
  }
  const n = A.length;

  for (i = 0; i < n; i++) {
    // Search for maximum in this column
    let maxEl = abs(A[i][i]),
      maxRow = i;
    for (k = i + 1; k < n; k++) {
      if (abs(A[k][i]) > maxEl) {
        maxEl = abs(A[k][i]);
        maxRow = k;
      }
    }

    // Swap maximum row with current row (column by column)
    for (k = i; k < n + 1; k++) {
      const tmp = A[maxRow][k];
      A[maxRow][k] = A[i][k];
      A[i][k] = tmp;
    }

    // Make all rows below this one 0 in current column
    for (k = i + 1; k < n; k++) {
      const c = -A[k][i] / A[i][i];
      for (j = i; j < n + 1; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
    }
  }

  // Solve equation Ax=b for an upper triangular matrix A
  x = arrayFill(0, n, 0);
  for (i = n - 1; i > -1; i--) {
    x[i] = A[i][n] / A[i][i];
    for (k = i - 1; k > -1; k--) {
      A[k][n] -= A[k][i] * x[i];
    }
  }

  return x;
}

// const { push } = Array.prototype;

function aug(a, b) {
  const newarr = [];
  for (let i = 0; i < a.length; i++) {
    newarr.push(a[i].slice());
  }
  for (let i = 0; i < newarr.length; i++) {
    newarr[i].push(b[i]);
  }
  return newarr;
}

export function gaussElimination(a, b) {
  const n = a.length;
  const m = a[0].length;
  let factor = 1;
  let sum = 0;
  const x = [];
  let pivot;
  let temp;
  let k;
  a = aug(a, b);
  const maug = a[0].length;
  for (let i = 0; i < n; i++) {
    pivot = a[i][i];
    let j = i;
    for (k = i + 1; k < m; k++) {
      if (pivot < Math.abs(a[k][i])) {
        pivot = a[k][i];
        j = k;
      }
    }
    if (j !== i) {
      for (k = 0; k < maug; k++) {
        temp = a[i][k];
        a[i][k] = a[j][k];
        a[j][k] = temp;
      }
    }
    for (j = i + 1; j < n; j++) {
      factor = a[j][i] / a[i][i];
      for (k = i; k < maug; k++) {
        a[j][k] = a[j][k] - factor * a[i][k];
      }
    }
  }
  for (let i = n - 1; i >= 0; i--) {
    sum = 0;
    for (let j = i + 1; j <= n - 1; j++) {
      sum = sum + x[j] * a[i][j];
    }
    x[i] = (a[i][maug - 1] - sum) / a[i][i];
  }
  return x;
}

// line a passes (x1,y1) and (x2,y2)
// line b passes (x3,y3) and (x4,y4)
export function lineIntersection(x1, x2, x3, x4, y1, y2, y3, y4) {
  const a1 = y2 - y1;
  const b1 = x1 - x2;
  const c1 = a1 * x1 + b1 * y1;
  const a2 = y4 - y3;
  const b2 = x3 - x4;
  const c2 = a2 * x3 + b2 * y3;
  const det = a1 * b2 - a2 * b1;
  if (det === 0) {
    return null;
  } else {
    const x = (b2 * c1 - b1 * c2) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    return { x, y };
  }
}

export function lineIntersection3(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4) {
  // ( P1 - P3 + mua (P2 - P1) - mub (P4 - P3) ) dot (P2 - P1) = 0
  // ( P1 - P3 + mua (P2 - P1) - mub (P4 - P3) ) dot (P4 - P3) = 0
  // d1321 + mua d2121 - mub d4321 = 0
  // d1343 + mua d4321 - mub d4343 = 0
  // const d = dmnop = (xm - xn)(xo - xp) + (ym - yn)(yo - yp) + (zm - zn)(zo - zp)
  // mua = ( d1343 d4321 - d1321 d4343 ) / ( d2121 d4343 - d4321 d4321 )
  // mub = ( d1343 + mua d4321 ) / d4343
  // https://paulbourke.net/geometry/pointlineplane/
  const d1321 = (x1 - x3) * (x2 - x1) + (y1 - y3) * (y2 - y1) + (z1 - z3) * (z2 - z1);
  const d2121 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
  const d4321 = (x4 - x3) * (x2 - x1) + (y4 - y3) * (y2 - y1) + (z4 - z3) * (z2 - z1);
  const d1343 = (x1 - x3) * (x4 - x3) + (y1 - y3) * (y4 - y3) + (z1 - z3) * (z4 - z3);
  const d4343 = (x4 - x3) * (x4 - x3) + (y4 - y3) * (y4 - y3) + (z4 - z3) * (z4 - z3);
  const mua = (d1343 * d4321 - d1321 * d4343) / (d2121 * d4343 - d4321 * d4321);
  const mub = (d1343 + mua * d4321) / d4343;
  const xa = x1 + mua * (x2 - x1);
  const ya = y1 + mua * (y2 - y1);
  const za = z1 + mua * (z2 - z1);
  const xb = x3 + mub * (x4 - x3);
  const yb = y3 + mub * (y4 - y3);
  const zb = z3 + mub * (z4 - z3);
  const dist = hypot(xa - xb, ya - yb, za - zb);
  return { xa, ya, za, xb, yb, zb, mua, mub, dist };
}
