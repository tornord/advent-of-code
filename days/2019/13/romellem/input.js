const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "..", "input.txt"), "utf8")
  .toString()
  .trim()
  .split(",")
  .map((num) => parseInt(num, 10));

module.exports = {
  input,
};
