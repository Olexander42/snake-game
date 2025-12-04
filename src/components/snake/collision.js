 import { bodyData } from "./snake.js";
 import { data as boardData } from "../board.js";

 const SHIFT_CONFIGS = {
  left: { axis: "x", direction: 1, side: 'left' },
  right: { axis: "x", direction: -1, side: 'left' },
  top: { axis: "y", direction: 1, side: 'top' },
  bottom: { axis: "y", direction: -1, side: 'top' },
}

export function getCollisionBorder(headCoords) {
  let collisionBorder = null;
  
  if (headCoords.x < boardData.left) collisionBorder = 'left';
  else if (headCoords.x > boardData.right) collisionBorder = 'right';
  else if (headCoords.y < boardData.top) collisionBorder = 'top';
  else if (headCoords.y > boardData.bottom) collisionBorder = 'bottom';

  return collisionBorder;
}

export function isHeadInsideBody(headCoords) {
  return bodyData.some(({ x, y }, i) => (i !==0 && (headCoords.x === x && headCoords.y === y)));
} 

export function isCollision(headCoords) {
  return getCollisionBorder(headCoords) && isHeadInsideBody(headCoords);
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
  updateBoardData(data);

  let verticalCollisionBorder =  null;
  let horizontalCollisionBorder = null;

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

    if (verticalCollisionBorder && horizontalCollisionBorder) break; // exit loop early
  }
}

  _shift(config) {
    bodyData.forEach((data, i) => {
      const coord = data[config.axis];
      const section = body[i];
      const newCoord = coord + boardData.step * config.direction;

      section.style[config.side] = `${newCoord}px`;
    })

    _snapshot(); // register the changes
  }

