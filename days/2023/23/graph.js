const graph = {
  "1,0": { node: { v: ".", x: 1, y: 0, h: "1,0" }, h: "1,0", ns: { "15,15": 141 } },
  "37,7": { node: { v: ".", x: 37, y: 7, h: "37,7" }, h: "37,7", ns: { "15,15": 154, "31,35": 198, "61,9": 250 } },
  "61,9": { node: { v: ".", x: 61, y: 9, h: "61,9" }, h: "61,9", ns: { "65,41": 144, "81,19": 214, "37,7": 250 } },
  "15,15": { node: { v: ".", x: 15, y: 15, h: "15,15" }, h: "15,15", ns: { "11,31": 64, "1,0": 141, "37,7": 154 } },
  "107,17": {
    node: { v: ".", x: 107, y: 17, h: "107,17" },
    h: "107,17",
    ns: { "101,33": 98, "81,19": 288, "133,39": 448 },
  },
  "81,19": { node: { v: ".", x: 81, y: 19, h: "81,19" }, h: "81,19", ns: { "77,41": 110, "61,9": 214, "107,17": 288 } },
  "11,31": { node: { v: ".", x: 11, y: 31, h: "11,31" }, h: "11,31", ns: { "15,15": 64, "31,35": 96, "5,59": 254 } },
  "101,33": {
    node: { v: ".", x: 101, y: 33, h: "101,33" },
    h: "101,33",
    ns: { "77,41": 92, "107,17": 98, "101,55": 102, "133,39": 218 },
  },
  "31,35": {
    node: { v: ".", x: 31, y: 35, h: "31,35" },
    h: "31,35",
    ns: { "11,31": 96, "37,61": 176, "37,7": 198, "65,41": 212 },
  },
  "133,39": {
    node: { v: ".", x: 133, y: 39, h: "133,39" },
    h: "133,39",
    ns: { "125,59": 152, "101,33": 218, "107,17": 448 },
  },
  "65,41": {
    node: { v: ".", x: 65, y: 41, h: "65,41" },
    h: "65,41",
    ns: { "77,41": 52, "61,9": 144, "63,67": 172, "31,35": 212 },
  },
  "77,41": {
    node: { v: ".", x: 77, y: 41, h: "77,41" },
    h: "77,41",
    ns: { "65,41": 52, "101,33": 92, "81,19": 110, "83,67": 160 },
  },
  "101,55": {
    node: { v: ".", x: 101, y: 55, h: "101,55" },
    h: "101,55",
    ns: { "103,75": 82, "101,33": 102, "83,67": 122, "125,59": 212 },
  },
  "5,59": { node: { v: ".", x: 5, y: 59, h: "5,59" }, h: "5,59", ns: { "15,85": 184, "11,31": 254, "37,61": 262 } },
  "125,59": {
    node: { v: ".", x: 125, y: 59, h: "125,59" },
    h: "125,59",
    ns: { "133,39": 152, "129,81": 194, "101,55": 212 },
  },
  "37,61": {
    node: { v: ".", x: 37, y: 61, h: "37,61" },
    h: "37,61",
    ns: { "43,85": 114, "63,67": 160, "31,35": 176, "5,59": 262 },
  },
  "63,67": {
    node: { v: ".", x: 63, y: 67, h: "63,67" },
    h: "63,67",
    ns: { "83,67": 68, "65,85": 72, "37,61": 160, "65,41": 172 },
  },
  "83,67": {
    node: { v: ".", x: 83, y: 67, h: "83,67" },
    h: "83,67",
    ns: { "77,89": 64, "63,67": 68, "101,55": 122, "77,41": 160 },
  },
  "103,75": {
    node: { v: ".", x: 103, y: 75, h: "103,75" },
    h: "103,75",
    ns: { "101,55": 82, "129,81": 124, "77,89": 144, "113,113": 240 },
  },
  "129,81": {
    node: { v: ".", x: 129, y: 81, h: "129,81" },
    h: "129,81",
    ns: { "103,75": 124, "125,101": 180, "125,59": 194 },
  },
  "15,85": { node: { v: ".", x: 15, y: 85, h: "15,85" }, h: "15,85", ns: { "43,85": 128, "11,103": 146, "5,59": 184 } },
  "43,85": {
    node: { v: ".", x: 43, y: 85, h: "43,85" },
    h: "43,85",
    ns: { "65,85": 102, "37,61": 114, "29,99": 124, "15,85": 128 },
  },
  "65,85": {
    node: { v: ".", x: 65, y: 85, h: "65,85" },
    h: "65,85",
    ns: { "77,89": 36, "63,67": 72, "43,85": 102, "65,113": 192 },
  },
  "77,89": {
    node: { v: ".", x: 77, y: 89, h: "77,89" },
    h: "77,89",
    ns: { "65,85": 36, "83,67": 64, "87,99": 72, "103,75": 144 },
  },
  "29,99": {
    node: { v: ".", x: 29, y: 99, h: "29,99" },
    h: "29,99",
    ns: { "43,85": 124, "11,103": 134, "43,125": 152, "65,113": 206 },
  },
  "87,99": {
    node: { v: ".", x: 87, y: 99, h: "87,99" },
    h: "87,99",
    ns: { "77,89": 72, "65,113": 108, "83,125": 114, "113,113": 176 },
  },
  "125,101": {
    node: { v: ".", x: 125, y: 101, h: "125,101" },
    h: "125,101",
    ns: { "113,113": 48, "129,81": 180, "127,137": 286 },
  },
  "11,103": {
    node: { v: ".", x: 11, y: 103, h: "11,103" },
    h: "11,103",
    ns: { "29,99": 134, "15,85": 146, "43,125": 530 },
  },
  "65,113": {
    node: { v: ".", x: 65, y: 113, h: "65,113" },
    h: "65,113",
    ns: { "63,125": 30, "87,99": 108, "65,85": 192, "29,99": 206 },
  },
  "113,113": {
    node: { v: ".", x: 113, y: 113, h: "113,113" },
    h: "113,113",
    ns: { "125,101": 48, "109,137": 176, "87,99": 176, "103,75": 240 },
  },
  "43,125": {
    node: { v: ".", x: 43, y: 125, h: "43,125" },
    h: "43,125",
    ns: { "63,125": 140, "29,99": 152, "11,103": 530 },
  },
  "63,125": {
    node: { v: ".", x: 63, y: 125, h: "63,125" },
    h: "63,125",
    ns: { "65,113": 30, "43,125": 140, "83,125": 204 },
  },
  "83,125": {
    node: { v: ".", x: 83, y: 125, h: "83,125" },
    h: "83,125",
    ns: { "87,99": 114, "63,125": 204, "109,137": 234 },
  },
  "109,137": {
    node: { v: ".", x: 109, y: 137, h: "109,137" },
    h: "109,137",
    ns: { "127,137": 34, "113,113": 176, "83,125": 234 },
  },
  "127,137": {
    node: { v: ".", x: 127, y: 137, h: "127,137" },
    h: "127,137",
    ns: { "109,137": 34, "139,140": 51, "125,101": 286 },
  },
  "139,140": { node: { v: ".", x: 139, y: 140, h: "139,140" }, h: "139,140", ns: { "127,137": 51 } },
};

function plotGraph(graph) {
  const vsDict = {};
  Object.entries(graph).forEach(([k, v]) =>
    Object.keys(v.ns).forEach((d) => {
      if (k < d) vsDict[`"N${k.replace(",", "-")}" -- "N${d.replace(",", "-")}"`] = true;
    })
  );
  const vs = Object.keys(vsDict);
  const s = `
    graph { 
      // rankdir=LR;
      // node [shape = doublecircle];
      // node [shape = circle];    
      ${vs.join("\n")}
    }
  `;
  console.log(s); // eslint-disable-line no-console
}

plotGraph(graph);