import {
  countBy,
  cumSum,
  filterIndices,
  findMax,
  findMaxIndex,
  findMin,
  findMinIndex,
  findRepition,
  findRepitionMany,
  groupBy,
  indexOf,
  intersectionSet,
  isNumeric,
  joinArray,
  matchNumbers,
  md5,
  minSearch,
  negMod,
  newArray,
  newMatrix,
  nodeFromHash,
  prod,
  range,
  reduceSet,
  reverseString,
  rotateArray,
  sortedInsert,
  splitArray,
  sum,
  swap,
  toDict,
  transpose,
  unionSet,
  uniquePermutations,
  zip,
} from ".";

const { exp, max } = Math;

describe("helpers", () => {
  test("isNumeric", () => {
    expect(["1", "2", "3"].map(isNumeric)).toEqual([true, true, true]);
    expect(["", 123, null, "123abc"].map(isNumeric)).toEqual([false, false, false, false]);
  });

  test("sum", () => {
    expect(sum([])).toEqual(0);
    expect(sum([1, 2, 3, 4, 5])).toEqual(15);
  });

  test("cumSum", () => {
    expect(cumSum([])).toEqual([]);
    expect(cumSum([1, 2, 3, 4, 5])).toEqual([1, 3, 6, 10, 15]);
  });

  test("filterIndices", () => {
    expect(filterIndices([1, 2, 3, 4, 5], (d) => d % 2)).toEqual([0, 2, 4]);
  });

  test("swap", () => {
    const a = [1, 2, 3];
    swap(a, 1, 2);
    expect(a).toEqual([1, 3, 2]);
  });

  test("prod", () => {
    expect(prod([])).toEqual(1);
    expect(prod([1, 2, 3, 4, 5])).toEqual(120);
  });

  test("range", () => {
    expect(range(0, 6)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(range(0, 0)).toEqual([0]);
    expect(range(3, 7)).toEqual([3, 4, 5, 6, 7]);
    expect(range(7, 49, 7)).toEqual([7, 14, 21, 28, 35, 42, 49]);
    expect(range(20, -5, 5)).toEqual([20, 15, 10, 5, 0, -5]);
    expect(range(20, -5, -5)).toEqual([20, 15, 10, 5, 0, -5]);
    expect(range(4, 10, -2)).toEqual([4, 6, 8, 10]);
    expect(range(1, 4.9, 1)).toEqual([1, 2, 3, 4]);
  });

  test("newArray", () => {
    expect(newArray(7)).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(newArray(7, (i) => i)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test("newMatrix", () => {
    expect(newMatrix(4, 3)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    expect(newMatrix(2, 3, (x, y) => x * y)).toEqual([
      [0, 0, 0],
      [0, 1, 2],
    ]);
    expect(newMatrix(2, 4, () => null)).toEqual([
      [null, null, null, null],
      [null, null, null, null],
    ]);
  });

  test("unionSet", () => {
    const u = unionSet([3, 15, 0, 2, 22], [2, 0, 12, 3, 7], [], [2]);
    expect(u).toEqual(["0", "2", "3", "7", "12", "15", "22"]);
  });

  test("intersectionSet / andSet", () => {
    const r1 = intersectionSet(["a", "b", "c", "d"], ["b", "c", "d", "e"]);
    r1.sort((d1, d2) => (d1 < d2 ? -1 : 1));
    expect(r1).toEqual(["b", "c", "d"]);
    const r2 = intersectionSet(["a", "b", "c", "d"], []);
    expect(r2).toEqual([]);
    const r3 = intersectionSet(["a", "b", "c", "d"], ["e", "f", "g", "h"]);
    expect(r3).toEqual([]);
    const r4 = intersectionSet(["a", "b", "c", "d"], ["b", "c", "d", "h"], ["e", "c", "g", "h"]);
    expect(r4).toEqual(["c"]);
  });

  test("reduceSet", () => {
    const r = reduceSet([3, 15, 0, 2, 22], [2, 0, 12, 3, 7], [], [15]);
    expect(r).toEqual(["22"]);
  });

  test("xorSet", () => {
    const strToSet = (s) => new Set(s.split(""));
    const xorSet = (a, b) => {
      return new Set([...a, ...b].filter((d) => (a.has(d) ? 1 : 0) + (b.has(d) ? 1 : 0) === 1));
    };
    expect([...xorSet(strToSet("abcd"), strToSet("cde")).keys()].join("")).toBe("abe");
  });

  test("transpose", () => {
    const t1 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const t2 = transpose(t1);
    expect(t2).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
    expect(transpose(t1.map((r) => r.slice(0, 2)))).toEqual([
      [1, 4, 7],
      [2, 5, 8],
    ]);
    expect(transpose(t1.slice(0, 2))).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  test("zip", () => {
    const t1 = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const t2 = zip(...t1);
    expect(t2).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });

  test("toDict", () => {
    expect(toDict([1, 2, 3, 4], null, null)).toEqual({ 1: null, 2: null, 3: null, 4: null });
    expect(toDict([1, 2, 3, 4], null, true)).toEqual({ 1: true, 2: true, 3: true, 4: true });
    expect(toDict([1, 2, 3, 4], null, (d) => d + 1)).toEqual({ 1: 2, 2: 3, 3: 4, 4: 5 });
    expect(toDict([1, 2, 3, 4], null, (_, i) => i)).toEqual({ 1: 0, 2: 1, 3: 2, 4: 3 });
    expect(
      toDict(
        [{ n: "A" }, { n: "B" }, { n: "C" }],
        (d) => d.n,
        (d, i) => i
      )
    ).toEqual({ A: 0, B: 1, C: 2 });
    expect(
      toDict(
        ["a", "b", "c"],
        (d, i) => i,
        (d) => d
      )
    ).toEqual({ 0: "a", 1: "b", 2: "c" });
  });

  test("groupBy", () => {
    expect(groupBy(["a", "b", "c"])).toEqual({ a: ["a"], b: ["b"], c: ["c"] });
    expect(groupBy(["a", "b", "c", "a"])).toEqual({ a: ["a", "a"], b: ["b"], c: ["c"] });
    expect(
      groupBy(
        [
          { n: "a", x: 3 },
          { n: "a", x: 4 },
          { n: "b", x: 5 },
          { n: "c", x: 6 },
        ],
        (d) => d.n
      )
    ).toEqual({
      a: [
        { n: "a", x: 3 },
        { n: "a", x: 4 },
      ],
      b: [{ n: "b", x: 5 }],
      c: [{ n: "c", x: 6 }],
    });
  });

  test("groupBy with value function", () => {
    expect(
      groupBy(
        [
          { n: "a", x: 3 },
          { n: "a", x: 4 },
          { n: "b", x: 5 },
          { n: "c", x: 6 },
        ],
        (d) => d.n,
        (d) => d.x
      )
    ).toEqual({
      a: [3, 4],
      b: [5],
      c: [6],
    });
    expect(
      groupBy(
        [
          { n: "a", x: 3 },
          { n: "a", x: 4 },
          { n: "b", x: 5 },
          { n: "c", x: 6 },
        ],
        (d) => d.n,
        (_, i) => i
      )
    ).toEqual({
      a: [0, 1],
      b: [2],
      c: [3],
    });
  });

  test("countBy", () => {
    expect(countBy(["A", "A", "B", "A", "C", "B"])).toEqual({ A: 3, B: 2, C: 1 });
  });

  test("uniquePermutations", () => {
    expect(uniquePermutations(["a", "b", "c"]).length).toEqual(6);
    expect(uniquePermutations(["a", "a", "a", "b", "b", "b"]).length).toEqual(20);
    expect(uniquePermutations(["a", "b", "c"]).map((d) => d.join("")).join(",")).toEqual("abc,acb,bac,bca,cab,cba"); // prettier-ignore
  });

  test("indexOf", () => {
    expect(indexOf(10, [])).toBe(-1);
    expect(indexOf(0.5, [1, 2, 3, 4])).toBe(-1);
    expect(indexOf(1.5, [1, 2, 3, 4])).toBe(0);
    expect(indexOf(2.5, [1, 2, 3, 4])).toBe(1);
    expect(indexOf(3.5, [1, 2, 3, 4])).toBe(2);
    expect(indexOf(4.5, [1, 2, 3, 4])).toBe(3);
    expect(indexOf(11, [5, 13])).toBe(0);
    expect(indexOf(11, [5])).toBe(0);
    expect(indexOf(11, [13])).toBe(-1);
    expect(indexOf(2, [1, 2, 3])).toBe(1);
  });

  // test.only("indexOf2", () => {
  //   expect(indexOf2(10, [])).toBe(-1);
  //   expect(indexOf2(0.5, [1, 2, 3, 4])).toBe(-1);
  //   expect(indexOf2(1.5, [1, 2, 3, 4])).toBe(0);
  //   expect(indexOf2(2.5, [1, 2, 3, 4])).toBe(1);
  //   expect(indexOf2(3.5, [1, 2, 3, 4])).toBe(2);
  //   expect(indexOf2(4.5, [1, 2, 3, 4])).toBe(3);
  //   expect(indexOf2(11, [5, 13])).toBe(0);
  //   expect(indexOf2(11, [5])).toBe(0);
  //   expect(indexOf2(11, [13])).toBe(-1);
  //   expect(indexOf2(2, [1, 2, 3])).toBe(1);
  // });

  test("indexOf with value fun", () => {
    const values = [
      9, 13, 21, 22, 30, 39, 46, 55, 58, 63, 63, 65, 70, 76, 82, 85, 85, 93, 101, 108, 109, 116, 123, 123, 124, 128,
    ];
    const valueObjects = values.map((d) => ({ value: d }));
    const lookupValues = newArray(14, (i) => 10 * i);
    const lookupObjects = lookupValues.map((d) => ({ value: d }));
    const res = [];
    for (const y of lookupObjects) {
      const x = indexOf(y, valueObjects, (d1, d2) => d1.value - d2.value);
      res.push(x);
    }
    expect(res).toEqual([-1, 0, 1, 4, 5, 6, 8, 12, 13, 16, 17, 20, 21, 25]);
  });

  test("sortedInsert", () => {
    const cases = [
      { v: 0.5, e: [0.5, 1, 2, 3, 4] },
      { v: 1.5, e: [1, 1.5, 2, 3, 4] },
      { v: 2.5, e: [1, 2, 2.5, 3, 4] },
      { v: 3.5, e: [1, 2, 3, 3.5, 4] },
      { v: 4.5, e: [1, 2, 3, 4, 4.5] },
    ];
    for (const c of cases) {
      expect(sortedInsert(c.v, [1, 2, 3, 4])).toEqual(c.e);
    }

    for (const c of cases) {
      const res = sortedInsert(
        { value: c.v },
        [1, 2, 3, 4].map((d) => ({ value: d })),
        (d1, d2) => d1.value - d2.value
      );
      const expected = c.e.map((d) => ({ value: d }));
      expect(res).toEqual(expected);
    }
  });

  test("rotateArray", () => {
    expect(rotateArray([0, 1, 2, 3, 4, 5], 1, 2, 5)).toEqual([0, 1, 4, 2, 3, 5]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], -1, 1, 4)).toEqual([0, 2, 3, 1, 4, 5]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], 0, 1, 4)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], 1)).toEqual([5, 0, 1, 2, 3, 4]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], -5)).toEqual([5, 0, 1, 2, 3, 4]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], -6)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], 5)).toEqual([1, 2, 3, 4, 5, 0]);
    expect(rotateArray([0, 1, 2, 3, 4, 5], 6)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test("md5", () => {
    expect(md5("abc")).toBe("900150983cd24fb0d6963f7d28e17f72");
  });

  test("reverseString", () => {
    expect(reverseString("")).toBe("");
    expect(reverseString("abcdef")).toBe("fedcba");
  });

  test("findMin", () => {
    const xs1 = [1, 2, 3, 4, 5];
    expect(findMin(xs1)).toBe(1);

    const xs2 = [1, 2, 3, 4, 5].map((d) => ({ v: d }));
    expect(findMin(xs2, (d) => d.v)).toEqual({ v: 1 });
    expect(findMin(xs2, (d) => -d.v)).toEqual({ v: 5 });
  });

  test("findMin, second min", () => {
    const xs2 = [1, 2, 3, 4, 5].map((d) => ({ v: d }));
    const valueFun = (d) => d.v;
    const x0 = findMin(xs2, valueFun);
    expect(x0).toEqual({ v: 1 });
    expect(findMin(xs2, valueFun, (d) => d !== x0)).toEqual({ v: 2 });
  });

  test("findMinIndex", () => {
    const xs1 = [1, 2, 3, 4, 5];
    expect(findMinIndex(xs1)).toBe(0);

    const xs2 = [1, 2, 3, 4, 5].map((d) => ({ v: d }));
    expect(findMinIndex(xs2, (d) => d.v)).toEqual(0);
    expect(findMinIndex(xs2, (d) => -d.v)).toEqual(4);
    const { abs } = Math;
    expect(findMinIndex(xs2, (d) => abs(d.v - 3))).toEqual(2);
  });

  test("findMax", () => {
    const xs1 = [1, 2, 3, 4, 5];
    expect(findMax(xs1)).toBe(5);

    const xs2 = [1, 2, 3, 4, 5].map((d) => ({ v: d }));
    expect(findMax(xs2, (d) => d.v)).toEqual({ v: 5 });
    expect(findMax(xs2, (d) => -d.v)).toEqual({ v: 1 });
  });

  test("findMaxIndex", () => {
    const xs1 = [1, 2, 3, 4, 5];
    expect(findMaxIndex(xs1)).toBe(4);

    const xs2 = [1, 2, 3, 4, 5].map((d) => ({ v: d }));
    expect(findMaxIndex(xs2, (d) => d.v)).toEqual(4);
    expect(findMaxIndex(xs2, (d) => -d.v)).toEqual(0);
    const { abs } = Math;
    expect(findMaxIndex(xs2, (d) => abs(d.v - 3.5))).toEqual(0);
  });

  test("minSearch", () => {
    const testFun =
      (m, k = 5) =>
      (i) => {
        return 1 - exp(-(((i - m) / k) ** 2));
      };

    const a = 0;
    const b = 19;
    let c = minSearch(a, b, testFun(13));
    expect(c).toBe(13);

    c = minSearch(a, b, testFun(-1));
    expect(c).toBe(0);

    c = minSearch(a, b, testFun(20));
    expect(c).toBe(19);

    for (let i = 0; i < 20; i++) {
      expect(minSearch(a, b, testFun(i))).toBe(i);
    }

    c = minSearch(0, 1999, testFun(1159, 500));
    expect(c).toBe(1159);
  });

  test("minSearch count evals", () => {
    const testFun = (m, k = 5) => {
      let n = 0;
      const f = (i) => {
        n++;
        return 1 - exp(-(((i - m) / k) ** 2));
      };
      f.getN = () => n;
      return f;
    };

    const fun = testFun(1159, 500);
    minSearch(0, 1999, fun);
    expect(fun.getN()).toBe(37);

    const res = [];
    for (let i = 0; i < 2000; i++) {
      const f = testFun(i, 500);
      minSearch(0, 1999, f);
      res.push(f.getN());
    }
    const ns = countBy(res);
    expect(max(...Object.keys(ns).map(Number))).toBe(37);
  });

  test("matchNumbers", () => {
    expect(matchNumbers("a1b2c3d4e5f")).toEqual([1, 2, 3, 4, 5]);
    expect(matchNumbers("1abc2")).toEqual([1, 2]);
    expect(matchNumbers("abc")).toEqual([]);
    expect(matchNumbers("")).toEqual([]);
  });

  test("splitArray", () => {
    const a1 = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(splitArray(a1, (d) => d === 3)).toEqual([
      [1, 2],
      [4, 5, 6, 7, 8],
    ]);

    const a2 = "abc xyz def".split("");
    expect(splitArray(a2, (d) => d === " ").map((d) => d.join(""))).toEqual(["abc", "xyz", "def"]);

    const a3 = "abc xyz def".split("").map((d) => (d === " " ? null : d));
    expect(splitArray(a3).map((d) => d.join(""))).toEqual(["abc", "xyz", "def"]);
  });

  test("joinArray", () => {
    const a1 = [1, 2, 3, 4, 5, 6, 7, 8];
    const a2 = splitArray(a1, (d) => d === 3);
    expect(joinArray(a2, [3])).toEqual(a1);
    expect(joinArray(a2)).toEqual(a1.filter((d) => d !== 3));
    expect(joinArray([])).toEqual([]);
    expect(joinArray([[], [], []])).toEqual([]);
  });

  test("nodeFromHash", () => {
    expect(nodeFromHash("1,2")).toEqual({ x: 1, y: 2 });
    expect(nodeFromHash("3,4,5")).toEqual({ x: 3, y: 4, z: 5 });
  });

  test("negMod", () => {
    const ns = newArray(20, (i) => i - 10);
    const ms = ns.map((n) => negMod(n, 7));
    expect(ns.map((d) => d % 7)).toEqual([-3, -2, -1, -0, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2]);
    expect(ms).toEqual([4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2]);
  });

  describe("findRepition", () => {
    test("1", () => {
      const initState = "0";
      const nextFn = (s) => String((Number(s) + 1) % 17);
      const toHash = (s) => s;
      const res = findRepition(initState, nextFn, toHash);
      expect(res).toEqual({ index: 0, modulo: 17 });
    });

    const repFn = (m) => (i) => (i < 0 ? i + 1 : (i + 1) % m);

    test("2", () => {
      for (const i0 of [12, 13, 14]) {
        const initState = -i0;
        const nextFn = repFn(17);
        const toHash = (s) => String(s);
        const res = findRepition(initState, nextFn, toHash);
        expect(res).toEqual({ index: i0, modulo: 17 });
      }
    });

    test("many 1", () => {
      const mod = 19;
      const rFn = repFn(mod);
      const i0s = [12, 13, 14];
      const initState = i0s.map((i) => -i);
      const nextFn = (s) => s.map(rFn);
      const toHash = (s, i) => String(s[i]);
      const res = findRepitionMany(initState, nextFn, toHash, i0s.length);
      expect(res).toEqual(i0s.map((i) => ({ index: i, modulo: mod })));
    });
  });
});
