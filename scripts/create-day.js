import { join, resolve } from "path";
import fs from "fs";

import prompts from "prompts";

export function copyAssetFile(filePath, filename, srcFolder, destFolder, replace = true) {
  const f = join(destFolder, filePath, filename);
  if (!replace && fs.existsSync(f)) {
    return;
  }
  const content = fs.readFileSync(join(srcFolder, filePath, filename), "utf-8");
  if (!fs.existsSync(join(destFolder, filePath))) {
    fs.mkdirSync(join(destFolder, filePath), { recursive: true });
  }
  fs.writeFileSync(join(destFolder, filePath, filename), content, "utf-8");
}

function regenerateIndexJs(year = null) {
  const folders = [".", "days"];
  if (year !== null) {
    folders.push(year);
  }
  const folder = resolve(...folders);
  const files = fs.readdirSync(folder).filter((f) => fs.lstatSync(join(folder, f)).isDirectory() && /^\d+$/.test(f));
  files.sort((d1, d2) => Number(d1) - Number(d2));
  const js = files.map((d) => `export * from "./${d}";\n`).join("");
  fs.writeFileSync(join(folder, "index.js"), js, "utf-8");
}

function createDay(year, day) {
  const daysFolder = resolve(".", "days");
  const assetFolder = join(daysFolder, "template");
  const destFolder = join(daysFolder, year, day);

  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  copyAssetFile(".", "index.js", assetFolder, destFolder, false);
  copyAssetFile(".", "loader.js", assetFolder, destFolder, false);
  copyAssetFile(".", "eslint.config.mjs", assetFolder, destFolder);

  for (const d of ["example.txt", "input.txt"]) {
    const f = join(destFolder, d);
    if (!fs.existsSync(f)) {
      fs.writeFileSync(f, "", "utf-8");
    }
  }

  regenerateIndexJs(year);
  regenerateIndexJs();

  // const indexFile = join(destFolder, "index.js");
  // let js = fs.readFileSync(indexFile, "utf-8");
  // js = js.replace(/dayXXXXYY/g, `day${year}${day.padStart(2, "0")}`);
  // fs.writeFileSync(indexFile, js, "utf-8");
}

// createDay("2022", "10");

async function main() {
  const args = process.argv.slice(2);

  let day;
  let year;
  if (args.length >= 2) {
    year = args[0];
    day = args[1];
    createDay(year, day);
  }

  if (!year || !day) {
    const date = new Date();
    const resp = await prompts([
      {
        type: "text",
        name: "year",
        message: "Year (four digits)",
        initial: String(date.getFullYear()),
      },
      {
        type: "text",
        name: "day",
        message: "Day",
        initial: String(date.getDate()),
      },
    ]);
    year = resp.year;
    day = resp.day;
  }
  if (!(Number(year) >= 2014 && Number(day) >= 1 && Number(day) <= 25)) {
    throw new Error("Invalid year/day", year, day);
  }
  createDay(year, day);
}

main();
