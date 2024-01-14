import { parseRow, parseToken } from "./inputParser";

describe("parseToken", () => {
  test("idx", () => {
    const r = "  3/4";
    expect(parseToken(r, 0)).toEqual({ type: "spec", value: " ", pos: 0, len: 2 });
    expect(parseToken(r, 2)).toEqual({ type: "int", value: "3", pos: 2, len: 1 });
    expect(parseToken(r, 3)).toEqual({ type: "spec", value: "/", pos: 3, len: 1 });
  });

  test("white space", () => {
    expect(parseToken(" \t\t ", 0)).toEqual({ type: "spec", value: " ", pos: 0, len: 4 });
    for (let i = 0; i < 3; i++) {
      expect(parseToken(" \tx  y\t\tz", 3 * i)).toEqual({ type: "spec", value: " ", pos: 3 * i, len: 2 });
    }
  });

  test("spec type", () => {
    expect(parseToken("1@2", 1)).toEqual({ type: "spec", value: "@", pos: 1, len: 1 });
    expect(parseToken("PBNSF => XSFVQ", 6)).toEqual({ type: "spec", value: "=>", pos: 6, len: 2 });
    expect(parseToken("A -> B", 2)).toEqual({ type: "spec", value: "->", pos: 2, len: 2 });
    expect(parseToken("1..2", 1)).toEqual({ type: "spec", value: "..", pos: 1, len: 2 });
    expect(parseToken("3x11x24", 1)).toEqual({ type: "spec", value: "x", pos: 1, len: 1 });
  });

  test("str type", () => {
    expect(parseToken("hello", 0)).toEqual({ type: "str", value: "hello", pos: 0, len: 5 });
    expect(parseToken("hello ", 0)).toEqual({ type: "str", value: "hello", pos: 0, len: 5 });
    expect(parseToken("hello.", 0)).toEqual({ type: "str", value: "hello", pos: 0, len: 5 });
  });

  test("int/float type", () => {
    expect(parseToken("123", 0)).toEqual({ type: "int", value: "123", pos: 0, len: 3 });
    expect(parseToken("123 ", 0)).toEqual({ type: "int", value: "123", pos: 0, len: 3 });
    expect(parseToken("-123 ", 0)).toEqual({ type: "int", value: "-123", pos: 0, len: 4 });
    expect(parseToken("+123 ", 0)).toEqual({ type: "int", value: "+123", pos: 0, len: 4 });
    expect(parseToken("1.23", 0)).toEqual({ type: "float", value: "1.23", pos: 0, len: 4 });
    expect(parseToken("-1.23", 0)).toEqual({ type: "float", value: "-1.23", pos: 0, len: 5 });
    expect(parseToken("12-34 ", 0)).toEqual({ type: "int", value: "12", pos: 0, len: 2 });
    expect(parseToken("12-34 ", 2)).toEqual({ type: "spec", value: "-", pos: 2, len: 1 });
    expect(parseToken("12+34 ", 2)).toEqual({ type: "spec", value: "+", pos: 2, len: 1 });
    expect(parseToken("12 -34 ", 3)).toEqual({ type: "int", value: "-34", pos: 3, len: 3 });
  });

  test("mix type", () => {
    expect(parseToken("p1", 0)).toEqual({ type: "mix", value: "p1", pos: 0, len: 2 });
    expect(parseToken("1p", 0)).toEqual({ type: "mix", value: "1p", pos: 0, len: 2 });
    expect(parseToken("0x123", 0)).toEqual({ type: "mix", value: "0x123", pos: 0, len: 5 });
    expect(parseToken("0x1ab2", 0)).toEqual({ type: "mix", value: "0x1ab2", pos: 0, len: 6 });
    expect(parseToken("x123", 0)).toEqual({ type: "mix", value: "x123", pos: 0, len: 4 });
  });
});

describe("parseRow", () => {
  test("indent", () => {
    let r;
    r = parseRow("  3/4");
    expect(r.indent).toEqual(2);
    r = parseRow("  \t3/4");
    expect(r.indent).toEqual(4);
    r = parseRow("  \t  3/4");
    expect(r.indent).toEqual(6);
  });

  test("trim end", () => {
    let r;
    r = parseRow("3/4 ");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int");
    r = parseRow("3/4 \t");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int");
  });

  test("white space", () => {
    let r;
    r = parseRow("  3/4");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int");
    r = parseRow("1 2 3, 4, 5,6,7 ");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int spec int spec int spec int spec int spec int");
    r = parseRow("#123 @  3, 2: 5x4 ");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("spec int spec int spec int spec int spec int");
  });

  test("tokens", () => {
    let r;
    r = parseRow("  3/4");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int");
    r = parseRow("#123 @ 3,2: 5x4");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("spec int spec int spec int spec int spec int");
    r = parseRow("1.23 - 4.56");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("float spec float");
    r = parseRow("hello there.");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("str spec str spec");
    r = parseRow("{ a: 123, b: 'xyz'}");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("spec str spec int spec str spec spec str spec spec");
    r = parseRow("34 => 56");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int");
    r = parseRow("1x2x3");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("int spec int spec int");
    r = parseRow("jio a, +19");
    expect(r.tokens.map((d) => d.type).join(" ")).toEqual("str spec str spec int");
  });

  // test("array", () => {
  //   let ss = [
  //     "66, -174, 512",
  //     "1,2,3,4",
  //     "5 6 7 8",
  //     "a-b-c-d",
  //     "x@y@z",
  //     "brk mbb mnr rkj",
  //     "EQ, QD, NP, ZP, KX",
  //     "810  679   10",
  //   ];
  //   let r;
  //   r = parseRow();
  //   expect(isArray(r.tokens)).toBe(true);
  // });
});
