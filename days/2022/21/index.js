function evaluate(id, tree, humnValue = null) {
  const node = tree[id];
  if (typeof node.value === "number") {
    if (humnValue === null || id !== "humn") return node.value;
    return humnValue;
  }
  const v1 = evaluate(node.childs[0], tree, humnValue);
  const v2 = evaluate(node.childs[1], tree, humnValue);
  if (node.op === "+") return v1 + v2;
  if (node.op === "-") return v1 - v2;
  if (node.op === "*") return v1 * v2;
  if (node.op === "/") return v1 / v2;
}

function evaluate2(id, tree, shouldBe) {
  const node = tree[id];
  if (typeof node.value === "number") return shouldBe;
  const left = hasHumn(node.childs[0], tree);
  const v = evaluate(node.childs[left ? 1 : 0], tree);
  let x;
  if (node.op === "+") {
    x = shouldBe - v;
  }
  if (node.op === "-") {
    x = left ? shouldBe + v : v - shouldBe;
  }
  if (node.op === "*") {
    x = shouldBe / v;
  }
  if (node.op === "/") {
    x = left ? shouldBe * v : v / shouldBe;
  }
  return evaluate2(node.childs[left ? 0 : 1], tree, x);
}

function hasHumn(id, tree) {
  const node = tree[id];
  if (node.id === "humn") return true;
  if (typeof node.value === "number") return false;
  return hasHumn(node.childs[0], tree) || hasHumn(node.childs[1], tree);
}

function parseTree(rows) {
  const ny = rows.length;
  const tree = {};
  for (let y = 0; y < ny; y++) {
    const r = rows[y];
    const n = { id: r[0] };
    if (r.length === 2) {
      n.value = Number(r[1]);
    } else {
      n.op = r[2];
      n.childs = [r[1], r[3]];
    }
    tree[n.id] = n;
  }
  return tree;
}

function calc1(tree) {
  const v = evaluate("root", tree);
  return v;
}

function calc2(tree) {
  const root = tree.root;
  const left = hasHumn(root.childs[0], tree);
  const v = evaluate(root.childs[left ? 1 : 0], tree);
  const v2 = evaluate2(root.childs[left ? 0 : 1], tree, v);
  return v2;
}

export default function (inputRows) {
  const tree = parseTree(inputRows.map((r) => r.replace(":", "").split(" ")));
  return [calc1(tree), calc2(tree)];
}
