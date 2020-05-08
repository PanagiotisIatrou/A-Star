class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getNeib() {
    let list = []
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0)
          continue;
        list.push(createVector(i, j));
      }
    }
    return list;
  }

}

class WalkableNode extends Node {
  constructor(x, y, gCost = -1, hCost = -1, parent = null) {
    super(x, y);
    this.type = 'OPEN';
    this.gCost = gCost;
    this.hCost = hCost;
    this.parent = parent;
  }

  getFCost() {
    return this.gCost + this.hCost;
  }

  draw() {
    push();
    if (this.type == 'OPEN')
      fill(0, 255, 0);
    else if (this.type == 'CLOSED')
      fill(255, 0, 0);
    rect(this.x * NODE_SIZE, this.y * NODE_SIZE, NODE_SIZE, NODE_SIZE);
    pop();
  }
}

class UnwalkableNode extends Node {
  constructor(x, y) {
    super(x, y);
    this.type = 'OBSTACLE'
  }

  draw() {
    push();
    fill(30);
    rect(this.x * NODE_SIZE, this.y * NODE_SIZE, NODE_SIZE, NODE_SIZE);
    pop();
  }
}

class Pathfinder {
  constructor(sizeX, sizeY, nodeSize) {
    this.GRID_SIZE_X = 60;
    this.GRID_SIZE_Y = 35;
    this.NODE_SIZE = 20;

    this.unwalkableNodesList = []
  }

  getPath(startX, startY, targetX, targetY) {
    let openNodeList = []
    let closedNodeList = []

    // Check if the target node exists in the unwalkables list
    let existsInUnwalkables = false;
    for (let j = 0; j < this.unwalkableNodesList.length; j++) {
      if (this.unwalkableNodesList[j].x == targetX && this.unwalkableNodesList[j].y == targetY) {
        existsInUnwalkables = true;
        break;
      }
    }
    if (existsInUnwalkables)
      return [];

    let hCost = dist2(startX, startY, targetX, targetY);
    let startNode = new WalkableNode(startX, startY, 0, hCost);
    openNodeList.push(startNode);

    while (true) {
      // Find lowest cost open node
      let minF;
      let minH;
      let minIndex = -1;
      for (let i = 0; i < openNodeList.length; i++) {
        let fCost = openNodeList[i].getFCost()
        if (i == 0 || fCost < minF) {
          minF = fCost;
          minH = openNodeList[i].hCost;
          minIndex = i;
        }
        else if (fCost == minF) {
          if (openNodeList[i].hCost < minH) {
            minH = openNodeList[i].hCost;
            minIndex = i;
          }
        }
      }
      if (minIndex == -1)
        return [];

      let currentNode = openNodeList[minIndex];

      // Remove it from open nodes and add it to closed nodes
      openNodeList.splice(minIndex, 1);
      currentNode.type = 'CLOSED';
      closedNodeList.push(currentNode);

      // Check if found
      if (currentNode.x == targetX && currentNode.y == targetY) {
        break;
      }

      // Loop through all the neighbours
      let neibList = currentNode.getNeib()
      for (let i = 0; i < neibList.length; i++) {
        let v = neibList[i];
        let new_node = new WalkableNode(currentNode.x + v.x, currentNode.y + v.y);

        // Check if the neib node exists in the closed list
        let existsInClosed = false;
        for (let j = 0; j < closedNodeList.length; j++) {
          if (closedNodeList[j].x == new_node.x && closedNodeList[j].y == new_node.y) {
            existsInClosed = true;
            break;
          }
        }
        if (existsInClosed)
          continue;

        // Check if the neib node exists in the unwalkables list
        let existsInUnwalkables = false;
        for (let j = 0; j < this.unwalkableNodesList.length; j++) {
          if (this.unwalkableNodesList[j].x == new_node.x && this.unwalkableNodesList[j].y == new_node.y) {
            existsInUnwalkables = true;
            break;
          }
        }
        if (existsInUnwalkables)
          continue;

        let gCost = currentNode.gCost + dist2(currentNode.x, currentNode.y, currentNode.x + v.x, currentNode.y + v.y);
        let hCost = dist2(currentNode.x + v.x, currentNode.y + v.y, targetX, targetY);

        // Check if the neib node exists in the open list
        let existsInOpen = false;
        let ind = -1;
        for (let j = 0; j < openNodeList.length; j++) {
          if (openNodeList[j].x == new_node.x && openNodeList[j].y == new_node.y) {
            existsInOpen = true;
            ind = j;
            break;
          }
        }

        // Add the open node or update it
        if (!existsInOpen || gCost < openNodeList[ind].gCost) {
          if (existsInOpen)
            openNodeList.splice(ind, 1);

          new_node.gCost = gCost;
          new_node.hCost = hCost;
          new_node.parent = currentNode;
          openNodeList.push(new_node);
        }
      }
    }

    // Retrace the path
    let path = []
    let node = closedNodeList[closedNodeList.length - 1]
    while (node.parent != null) {
      path.push(node);
      node = node.parent;
    }

    return path.reverse();
  }

  addUnwalkableNode(x, y) {
    let node = new UnwalkableNode(x, y);
    this.unwalkableNodesList.push(node);
  }

  drawUnwalkableNodes() {
    for (let i = 0; i < this.unwalkableNodesList.length; i++) {
      this.unwalkableNodesList[i].draw();
    }
  }
}

function dist2(x1, y1, x2, y2) {
  let diffX = abs(x2 - x1);
  let diffY = abs(y2 - y1);
  let diff = min(diffY, diffX);
  diffX -= diff;
  diffY -= diff;

  return diff * 14 + (diffX + diffY) * 10;
}
