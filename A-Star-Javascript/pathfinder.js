class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  _getNeib(allowDiagonal=true) {
    let list = []
    if (allowDiagonal) {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i == 0 && j == 0)
            continue;
          list.push(createVector(i, j));
        }
      }
    } else {
      list.push(createVector(0, -1));
      list.push(createVector(0, 1));
      list.push(createVector(-1, 0));
      list.push(createVector(1, 0));
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
    else if (this.type == 'PATH')
      fill(0, 0, 255);
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
  constructor(sizeX, sizeY, nodeSize, allowDiagonal, distanceFunc) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.nodeSize = nodeSize;
    this.allowDiagonal = allowDiagonal;
    this.distanceFunc = distanceFunc;

    this.startX = -1;
    this.startY = -1;
    this.targetX = -1;
    this.targetY = -1;

    this.openNodeList = []
    this.closedNodeList = []
    this.unwalkableNodesList = []
  }

  // Returns the index in the list if found.
  // Returns -1 if not found
  static _nodeExistsInList(nodeX, nodeY, list) {
    for (let j = 0; j < list.length; j++) {
      if (list[j].x == nodeX && list[j].y == nodeY) {
        return j; // Found it
      }
    }
    return -1; // Didn't find it
  }

  // Custom distance function between 2 nodes (NOT USED)
  static _dist2(x1, y1, x2, y2) {
    let diffX = abs(x2 - x1);
    let diffY = abs(y2 - y1);
    let diff = min(diffY, diffX);
    diffX -= diff;
    diffY -= diff;

    return diff * 14 + (diffX + diffY) * 10;
  }

  static manhattanDistance(x1, y1, x2, y2) {
    let diffX = abs(x2 - x1);
    let diffY = abs(y2 - y1);
    return diffX + diffY;
  }

  static euclideanDistance(x1, y1, x2, y2) {
    let diffX = abs(x2 - x1);
    let diffY = abs(y2 - y1);
    return sqrt(diffX * diffX + diffY * diffY);
  }

  _isNodeInsideGrid(x, y) {
    if (x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY)
      return true;
    else
      return false;
  }

  setStartNode(x, y) {
    this.startX = x;
    this.startY = y;
  }

  setTargetNode(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  // Returns a list of all the nodes that make up the path starting from
  // (startX, startY) and ending in (targetX, targetY)
  getPath() {
    this.openNodeList = []
    this.closedNodeList = []

    // Check if the target node exists in the unwalkables list
    if (Pathfinder._nodeExistsInList(this.targetX, this.targetY, this.unwalkableNodesList) != -1)
      return [];

    let hCost = this.distanceFunc(this.startX, this.startY, this.targetX, this.targetY);
    let startNode = new WalkableNode(this.startX, this.startY, 0, hCost);
    this.openNodeList.push(startNode);

    while (true) {
      // Find lowest cost open node
      let minF;
      let minH;
      let minIndex = -1;
      for (let i = 0; i < this.openNodeList.length; i++) {
        let fCost = this.openNodeList[i].getFCost()
        if (i == 0 || fCost < minF) {
          minF = fCost;
          minH = this.openNodeList[i].hCost;
          minIndex = i;
        }
        else if (fCost == minF) {
          if (this.openNodeList[i].hCost < minH) {
            minH = this.openNodeList[i].hCost;
            minIndex = i;
          }
        }
      }
      if (minIndex == -1 || this.sizeX * this.sizeY == this.openNodeList.length + this.closedNodeList.length - this.unwalkableNodesList.length)
        return [];

      let currentNode = this.openNodeList[minIndex];

      // Remove it from open nodes and add it to closed nodes
      this.openNodeList.splice(minIndex, 1);
      currentNode.type = 'CLOSED';
      this.closedNodeList.push(currentNode);

      // Check if found
      if (currentNode.x == this.targetX && currentNode.y == this.targetY) {
        break;
      }

      // Loop through all the neighbours
      let neibList = currentNode._getNeib(this.allowDiagonal)
      for (let i = 0; i < neibList.length; i++) {
        let v = neibList[i];
        let new_node = new WalkableNode(currentNode.x + v.x, currentNode.y + v.y);

        // Check if the neib node exists in the closed list
        if (Pathfinder._nodeExistsInList(new_node.x, new_node.y, this.closedNodeList) != -1)
          continue;

        // Check if the neib node exists in the unwalkables list
        if (Pathfinder._nodeExistsInList(new_node.x, new_node.y, this.unwalkableNodesList) != -1)
          continue;

        let gCost = currentNode.gCost + this.distanceFunc(currentNode.x, currentNode.y, currentNode.x + v.x, currentNode.y + v.y);
        let hCost = this.distanceFunc(currentNode.x + v.x, currentNode.y + v.y, this.targetX, this.targetY);

        // Check if the neib node exists in the open list
        let ind = Pathfinder._nodeExistsInList(new_node.x, new_node.y, this.openNodeList);
        let existsInOpen = ind != -1;

        // Check if path goes between 2 obstacles
        let canPass = true;
        if (abs(new_node.x - currentNode.x) + abs(new_node.y - currentNode.y) == 2) {
          if (Pathfinder._nodeExistsInList(currentNode.x, new_node.y, this.unwalkableNodesList) != -1 && Pathfinder._nodeExistsInList(new_node.x, currentNode.y, this.unwalkableNodesList) != -1) {
            canPass = false;
          }
        }

        // Add the open node or update it
        if ((!existsInOpen || gCost < this.openNodeList[ind].gCost) && canPass && this._isNodeInsideGrid(new_node.x, new_node.y)) {
          if (existsInOpen)
            this.openNodeList.splice(ind, 1);

          new_node.gCost = gCost;
          new_node.hCost = hCost;
          new_node.parent = currentNode;
          this.openNodeList.push(new_node);
        }
      }
    }

    // Retrace the path
    let path = []
    let node = this.closedNodeList[this.closedNodeList.length - 1]
    while (node.parent != null) {
      node.type = 'PATH';
      path.push(node);
      node = node.parent;
    }

    return path.reverse();
  }

  // Creates an unwalkable node
  addUnwalkableNode(x, y) {
    let node = new UnwalkableNode(x, y);
    this.unwalkableNodesList.push(node);
  }

  // Creates an unwalkable rectangle in (x, y) with width w and height h
  addUnwalkableRect(x, y, w, h) {
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        this.addUnwalkableNode(i, j);
      }
    }
  }

  // Draws all the unwalkable nodes the pathfinder instance has
  drawUnwalkableNodes() {
    for (let i = 0; i < this.unwalkableNodesList.length; i++) {
      this.unwalkableNodesList[i].draw();
    }
  }

  drawClosedTiles() {
    for (let i = 0; i < this.closedNodeList.length; i++) {
      if (i == 0) // Skip the first one as it is guaranteed to be the start node
        continue
      this.closedNodeList[i].draw();
    }
  }

  drawOpenTiles() {
    for (let i = 0; i < this.openNodeList.length; i++) {
      this.openNodeList[i].draw();
    }
  }

  drawPathTiles(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].draw();
    }
  }

  drawEverything() {
    let startNode = new WalkableNode(this.startX, this.startY);
    startNode.type = 'PATH'
    let endNode = new WalkableNode(this.targetX, this.targetY);
    endNode.type = 'PATH'

    startNode.draw();
    this.drawUnwalkableNodes();
    this.drawOpenTiles();
    this.drawClosedTiles();
    endNode.draw();
  }
}
