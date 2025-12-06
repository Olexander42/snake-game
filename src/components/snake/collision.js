 import { direction, bodyData, headData, newHeadData } from "./snake.js";
 import { data as boardData } from "../board.js";

 const SHIFT_CONFIGS = {
  left: { axis: "x", direction: 1, side: "left" },
  right: { axis: "x", direction: -1, side: "left" },
  top: { axis: "y", direction: 1, side: "top" },
  bottom: { axis: "y", direction: -1, side: "top" },
}


function calcNewHeadCoords() {   
  newHeadData.x = headData.x + boardData.step * Math.sign(direction.x);
  newHeadData.y = headData.y + boardData.step * Math.sign(direction.y);
}

export function isCollision() {
  calcNewHeadCoords();
  
  return getCollisionBorder() || isHeadBodyCollision();
}

export function getCollisionBorder() {
  if (newHeadData.x < boardData.left) return "left";
  if (newHeadData.x > boardData.right) return "right";
  if (newHeadData.y < boardData.top) return "top";
  if (newHeadData.y > boardData.bottom) return "bottom";
}

export function isHeadBodyCollision() {
  return bodyData.some(({ x, y }, i) => ((newHeadData.x === x && newHeadData.y === y)));
} 

export function isSnakeNearOppositeBorders() {
  return (
    // top and bottom border
    (bodyData.some(({ y }) => (y <= boardData.top + boardData.step) 
    && bodyData.some(({ y }) => (y >= boardData.bottom- boardData.step)))) 
    ||
    // left and right border
    ((bodyData.some(({ x }) => (x <= boardData.left + boardData.step))) 
    && (bodyData.some(({ x }) => (x >= boardData.right - boardData.step)))) 
  )
}

export function offsetShrink(data) {
  let verticalCollisionBorder;
  let horizontalCollisionBorder;

  for (const data of bodyData) {
    // _shift() can be executed only once for each border
    if (!verticalCollisionBorder) {
      verticalCollisionBorder = _getCollisionBorder(data.x, undefined); 
      if (verticalCollisionBorder) _shift(Snake.SHIFT_CONFIGS[verticalCollisionBorder]);
    }

    if (!horizontalCollisionBorder) {
      horizontalCollisionBorder = _getCollisionBorder(undefined, data.y); 
      if (horizontalCollisionBorder) _shift(Snake.SHIFT_CONFIGS[horizontalCollisionBorder]);
    }

    if (verticalCollisionBorder && horizontalCollisionBorder) break; 
  }
}

function shift(config) {
    bodyData.forEach((data, i) => {
      const coord = data[config.axis];
      const section = body[i];
      const newCoord = coord + boardData.step * config.direction;

      section.style[config.side] = `${newCoord}px`;
    })

    _snapshot(); // register the changes
  }

