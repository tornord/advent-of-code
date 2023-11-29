import fs from "fs";
import { join } from "path";

const { isArray } = Array;

function runPromise(input, importFun) {
  return new Promise((resolve, reject) => {
    let inputIndex = 0;
    const output = [];
    global.readline = () => (inputIndex < input.length ? input[inputIndex++] : null);
    global.print = (x) => {
      output.push(String(x));
    };
    importFun().then((_, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function readFile(f) {
  let rs = fs.readFileSync(f, "utf-8").split("\n");
  const idx = rs.findLastIndex((d) => d !== "") + 1;
  if (idx < rs.length) {
    rs = rs.slice(0, idx);
  }
  return rs;
}

export function testRunner(dir, name, inputFiles, outputFiles, moduleName) {
  // const dir = dirName(meta);
  // const { name, files } = scanFolder(dir);
  describe(name, () => {
    inputFiles.forEach((f, i) => {
      test(f, async () => {
        const input = readFile(join(dir, f));
        const outputFile = f.replace(".in", ".ans");
        let expected = null;
        if (outputFiles.findIndex((d) => d === outputFile) >= 0) {
          expected = readFile(join(dir, outputFile));
        }
        if (!expected || !isArray(expected) || expected.length === 0) return;
        const output = await runPromise(input, () => import(`${moduleName}?${i}`));
        if (expected) {
          expect(output).toEqual(expected);
        }
      });
    });
  });
}
