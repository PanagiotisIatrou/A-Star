# A-Star

## How to install
Add these 2 lines in your html file:
```html
<script src="p5.js"></script>
<script src="pathfinder.js"></script>
```

## How to use
#### Declaring
First of all you have to declare an instance of the Pathfinder class like this:
```javascript
let pathfinder = new Pathfinder(60, 30, 20);
```
The line above creates an 60x30 grid with 20pixel nodes where each node is walkable.  
#### Adding unwalkable nodes
You can start adding unwalkable nodes like this:
```javascript
pathfinder.addUnwalkableNode(15, 8);
```
The line above declares that the pathfinder can not walk on the node with position (x=15, y=8).
**Note** that adding obstacles is optional.
#### Finding path
You can start finding paths like this:
```javascript
let nodesList = pathfinder.getPath(5, 3, 25, 13);
```
The line above returns a list of all the nodes that make up the path. The start position is (x=5, y=3) and the target position is (x=25, y=13). You can then access the position of the nodes with
```javascript
nodesList[i].x
nodesList[i].y
```
**Note** that if the target node is unreachable then an empty list is returned.  
**Note** that if the target node happens to be an unwalkable node then an empty list is returned.
#### Useful functions
```addUnwalkableRect(x, y, w, h)``` creates an unwalkable rectangle in position (x, y) with w width and h height
