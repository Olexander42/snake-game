 import { direction, body, bodyData, headData, newHeadData, snapshot } from "./snake.js";
 import { data as boardData } from "../board.js";


export function isCollision() {
  calcNewHeadCoords();

  return getCollisionBorder(newHeadData.x, newHeadData.y) || isHeadBodyCollision();
}

function calcNewHeadCoords() {   
  newHeadData.x = headData.x + boardData.step * Math.sign(direction.x);
  newHeadData.y = headData.y + boardData.step * Math.sign(direction.y);
}

export function getCollisionBorder(x, y) {
  if (x < boardData.left) return "left";
  if (x > boardData.right) return "right";
  if (y < boardData.top) return "top";
  if (y > boardData.bottom) return "bottom";
}

export function isHeadBodyCollision() {
  return bodyData.some(({ x, y }, i) => ((newHeadData.x === x && newHeadData.y === y)));
} 


const SHIFT_CONFIGS = {
  left: { axis: "x", shiftDirection: 1, side: "left" },
  right: { axis: "x", shiftDirection: -1, side: "left" },
  top: { axis: "y", shiftDirection: 1, side: "top" },
  bottom: { axis: "y", shiftDirection: -1, side: "top" },
}

export function isSnakeNearOppositeBorders() {
  return (
    (bodyData.some(({ y }) => (y <= boardData.top + boardData.step) 
    && bodyData.some(({ y }) => (y >= boardData.bottom - boardData.step)))) 
    ||
    ((bodyData.some(({ x }) => (x <= boardData.left + boardData.step))) 
    && (bodyData.some(({ x }) => (x >= boardData.right - boardData.step)))) 
  )
}

export function offsetShrink(data) {
  let verticalCollisionBorder;
  let horizontalCollisionBorder;

  for (const { x, y } of bodyData) {
    // shift() can be executed only once for each border
    if (!verticalCollisionBorder) {
      verticalCollisionBorder = getCollisionBorder( x, undefined); 
      if (verticalCollisionBorder) shift(SHIFT_CONFIGS[verticalCollisionBorder]);
    }

    if (!horizontalCollisionBorder) {
      horizontalCollisionBorder = getCollisionBorder(undefined, y); 
      if (horizontalCollisionBorder) shift(SHIFT_CONFIGS[horizontalCollisionBorder]);
    }
    console.log("verticalCollisionBorder:", verticalCollisionBorder);
    console.log("horizontalCollisionBorder:", horizontalCollisionBorder);
    if (verticalCollisionBorder && horizontalCollisionBorder) break; 
  }
}

function shift({ axis, shiftDirection, side }) {
  bodyData.forEach((data, i) => {
    const coord = data[axis];
    const el = body[i];
    const newCoord = coord + boardData.step * shiftDirection;

    el.style[side] = `${newCoord}px`;
  })

  snapshot();
}

