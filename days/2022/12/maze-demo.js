import { DistanceGrid, MazeGrid, RecursiveBacktracker } from "legendary-mazes";

const maze = new MazeGrid(2, 2);
const builder = new RecursiveBacktracker(maze);
const distances = new DistanceGrid(maze);

function build(showDistances = true) {
  builder.build();

  if (showDistances) {
    distances.build(maze.centralCell);
  }

  console.log(`generated an ${maze.width}x${maze.height} pixels maze`); // eslint-disable-line no-console
}

build();
