let GRID_SIZE_X = 60;
let GRID_SIZE_Y = 30;
let NODE_SIZE = 20;

let pathfinder;
let lst;

// Start position
let startX = 5;
let startY = 15;

function setup() {
  createCanvas(GRID_SIZE_X * NODE_SIZE, GRID_SIZE_Y * NODE_SIZE);
  noStroke();

  // Create an instance of the Pathfinder
  pathfinder = new Pathfinder(GRID_SIZE_X, GRID_SIZE_Y, NODE_SIZE, true, Pathfinder.euclideanDistance);
  pathfinder.setStartNode(startX, startY);

  // Add unwalkable lines
  pathfinder.addUnwalkableRect(20, 4, 1, 10);
  pathfinder.addUnwalkableRect(20, 16, 1, 10);
  pathfinder.addUnwalkableRect(40, 4, 1, 10);
  pathfinder.addUnwalkableRect(40, 16, 1, 10);

  pathfinder.addUnwalkableNode(29, 12);
  pathfinder.addUnwalkableNode(30, 12);
  pathfinder.addUnwalkableNode(28, 13);
  pathfinder.addUnwalkableNode(28, 14);
  pathfinder.addUnwalkableNode(28, 15);
  pathfinder.addUnwalkableNode(28, 16);
  pathfinder.addUnwalkableNode(31, 13);
  pathfinder.addUnwalkableNode(31, 14);
  pathfinder.addUnwalkableNode(31, 15);
  pathfinder.addUnwalkableNode(31, 16);
  pathfinder.addUnwalkableNode(29, 17);
  pathfinder.addUnwalkableNode(30, 17);
}

function draw() {
  background(80);

  // Set the target position to the mouse position
  let targetX = constrain(floor(mouseX / pathfinder.nodeSize), 0, pathfinder.sizeX - 1);
  let targetY = constrain(floor(mouseY / pathfinder.nodeSize), 0, pathfinder.sizeY - 1);
  pathfinder.setTargetNode(targetX, targetY);

  // Get Path
  lst = pathfinder.getPath();

  // Visualize everything
  pathfinder.drawEverything();
}
