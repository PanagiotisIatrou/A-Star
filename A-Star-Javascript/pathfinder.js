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
  constructor(sizeX, sizeY, nodeSize, allowDiagonal=true) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.nodeSize = nodeSize;
    this.allowDiagonal = allowDiagonal;

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

  // Returns the h distance between 2 nodes
  static _dist2(x1, y1, x2, y2) {
    let diffX = abs(x2 - x1);
    let diffY = abs(y2 - y1);
    let diff = min(diffY, diffX);
    diffX -= diff;
    diffY -= diff;

    return diff * 14 + (diffX + diffY) * 10;
  }

  // Returns a list of all the nodes that make up the path starting from
  // (startX, startY) and ending in (targetX, targetY)
  getPath(startX, startY, targetX, targetY) {
    let openNodeList = []
    let closedNodeList = []

    // Check if the target node exists in the unwalkables list
    if (Pathfinder._nodeExistsInList(targetX, targetY, this.unwalkableNodesList) != -1)
      return [];

    let hCost = Pathfinder._dist2(startX, startY, targetX, targetY);
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
      if (minIndex == -1 || this.sizeX * this.sizeY == openNodeList.length + closedNodeList.length - this.unwalkableNodesList.length)
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
      let neibList = currentNode._getNeib(this.allowDiagonal)
      for (let i = 0; i < neibList.length; i++) {
        let v = neibList[i];
        let new_node = new WalkableNode(currentNode.x + v.x, currentNode.y + v.y);

        // Check if the neib node exists in the closed list
        if (Pathfinder._nodeExistsInList(new_node.x, new_node.y, closedNodeList) != -1)
          continue;

        // Check if the neib node exists in the unwalkables list
        if (Pathfinder._nodeExistsInList(new_node.x, new_node.y, this.unwalkableNodesList) != -1)
          continue;

        let gCost = currentNode.gCost + Pathfinder._dist2(currentNode.x, currentNode.y, currentNode.x + v.x, currentNode.y + v.y);
        let hCost = Pathfinder._dist2(currentNode.x + v.x, currentNode.y + v.y, targetX, targetY);

        // Check if the neib node exists in the open list
        let ind = Pathfinder._nodeExistsInList(new_node.x, new_node.y, openNodeList);
        let existsInOpen = ind != -1;

        // Check if path goes between 2 obstacles
        let canPass = true;
        if (abs(new_node.x - currentNode.x) + abs(new_node.y - currentNode.y) == 2) {
          if (Pathfinder._nodeExistsInList(currentNode.x, new_node.y, this.unwalkableNodesList) != -1 && Pathfinder._nodeExistsInList(new_node.x, currentNode.y, this.unwalkableNodesList) != -1) {
            canPass = false;
          }
        }

        // Add the open node or update it
        if ((!existsInOpen || gCost < openNodeList[ind].gCost) && canPass) {
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
}
