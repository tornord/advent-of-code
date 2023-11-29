const toState = (np, ns) => `${np}-${ns}`;
const fromState = (s) => s.split("-").map((d) => Number(d));

function previousStates(s) {
  let [np, ns] = fromState(s);
  let res = [];
  for (let i = np; i >= 1; i--) {
    let newp = np - i;
    if (newp > i) break;
    let news = i - newp;
    if (ns - news < 0) continue;
    res.push(toState(i, ns - news));
  }
  return res.reverse();
}

function nextStates(s) {
  let [np, ns] = fromState(s);
  let res = [];
  for (let i = 0; i <= np; i++) {
    let newp = i;
    let news = np - i;
    res.push(toState(np + newp, ns + news));
  }
  return res;
}

function threedprinter(rows) {
  const n = rows[0];
  const start = toState(1, 0);
  let states = {};
  for (let i = 1; i <= n; i++) {
    states[toState(i, n)] = 0;
  }
  let nn = 0;
  while (!(start in states)) {
    const isResentState = (mm) => (e) => e[1] === mm - 1;
    nn++;
    let states0 = Object.entries(states).filter(isResentState(nn));
    for (const [s] of states0) {
      const ss = previousStates(s);
      for (const c of ss) {
        let n0 = states[c];
        if (typeof n0 === "undefined" || nn < n0) {
          states[c] = nn;
        }
      }
    }
  }
  let n0 = states[start];
  return n0;
}

threedprinter([5]);
