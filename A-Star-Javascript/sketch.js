let GRID_SIZE_X = 60;
let GRID_SIZE_Y = 30;
let NODE_SIZE = 20;

let lst;
let pathfinder;

// Start position
let startX = 5;
let startY = 15;

function setup() {
  createCanvas(GRID_SIZE_X * NODE_SIZE, GRID_SIZE_Y * NODE_SIZE);
  noStroke();

  // Create an instance of the Pathfinder
  pathfinder = new Pathfinder(GRID_SIZE_X, GRID_SIZE_Y, NODE_SIZE);

  // Add unwalkable lines
  // pathfinder.addUnwalkableRect(20, 4, 1, 10);
  // pathfinder.addUnwalkableRect(20, 16, 1, 10);
  // pathfinder.addUnwalkableRect(30, 10, 1, 10);
  // pathfinder.addUnwalkableRect(40, 4, 1, 10);
  // pathfinder.addUnwalkableRect(40, 16, 1, 10);

  // pathfinder.addUnwalkableNode(20, 10);
  // pathfinder.addUnwalkableNode(22, 10);
  // pathfinder.addUnwalkableNode(21, 9);
  // pathfinder.addUnwalkableNode(21, 11);
  pathfinder.addUnwalkableNode(20, 10);
  pathfinder.addUnwalkableNode(21, 10);
  pathfinder.addUnwalkableNode(20, 13);
  pathfinder.addUnwalkableNode(21, 13);
  pathfinder.addUnwalkableNode(22, 11);
  pathfinder.addUnwalkableNode(22, 12);
  pathfinder.addUnwalkableNode(19, 11);
  pathfinder.addUnwalkableNode(19, 12);
}

function draw() {
  background(80);

  // Set the target position to the mouse position
  let targetX = constrain(floor(mouseX / pathfinder.nodeSize), 0, pathfinder.sizeX - 1);
  let targetY = constrain(floor(mouseY / pathfinder.nodeSize), 0, pathfinder.sizeY - 1);

  // Draw start node
  rect(startX * pathfinder.nodeSize, startY * pathfinder.nodeSize, pathfinder.nodeSize, pathfinder.nodeSize);

  // Draw path nodes
  lst = pathfinder.getPath(startX, startY, targetX, targetY);
  for (let i = 0; i < lst.length; i++) {
    lst[i].draw();
  }
  print(lst[lst.length - 1]);

  // Draw unwalkable nodes
  pathfinder.drawUnwalkableNodes();

  // Draw target node
  rect(targetX * pathfinder.nodeSize, targetY * pathfinder.nodeSize, pathfinder.nodeSize, pathfinder.nodeSize);
}
