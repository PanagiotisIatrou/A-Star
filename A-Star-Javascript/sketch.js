let GRID_SIZE_X = 60;
let GRID_SIZE_Y = 30;
let NODE_SIZE = 20;

let lst;
let pathfinder;

function setup() {
  createCanvas(GRID_SIZE_X * NODE_SIZE, GRID_SIZE_Y * NODE_SIZE);
  noStroke();

  pathfinder = new Pathfinder(GRID_SIZE_X, GRID_SIZE_Y, NODE_SIZE);

  for (let i = 0; i < 10; i++) {
    pathfinder.addUnwalkableNode(20, 4 + i);
  }

  for (let i = 0; i < 10; i++) {
    pathfinder.addUnwalkableNode(20, 16 + i);
  }

  for (let i = 0; i < 10; i++) {
    pathfinder.addUnwalkableNode(30, 10 + i);
  }

  for (let i = 0; i < 10; i++) {
    pathfinder.addUnwalkableNode(40, 4 + i);
  }

  for (let i = 0; i < 10; i++) {
    pathfinder.addUnwalkableNode(40, 16 + i);
  }
}

function draw() {
  background(80);

  let startX = 5;
  let startY = 15;

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

  // Draw unwalkable nodes
  pathfinder.drawUnwalkableNodes();

  // Draw target node
  rect(targetX * pathfinder.nodeSize, targetY * pathfinder.nodeSize, pathfinder.nodeSize, pathfinder.nodeSize);
}
