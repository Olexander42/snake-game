import { step, initStep, getBodyElements, getBodyData, getHeadCoords, getDirection, getBoardData } from "./data.js";
import { snapshot } from "./snake.js";


export function calcNewHeadCoords() {  
  step ?? initStep();

  return {
    x: getHeadCoords().x + step * Math.sign(getDirection().x),
    y: getHeadCoords().y + step * Math.sign(getDirection().y)
  }
}

export function isCollision(newHeadCoords) {
  const isHeadBodyCollision = getBodyData().some(({ x, y }) => newHeadCoords.x === x && newHeadCoords.y === y);

  return (isHeadBodyCollision || getCollisionBorder(newHeadCoords));
}

function getCollisionBorder({ x, y }) {
  const { left, right, top, bottom } = getBoardData();

  if (x < left) return "left";
  if (x > right) return "right";
  if (y < top) return "top";
  if (y > bottom) return "bottom";
}


const SHIFT_CONFIGS = {
  left: { axis: "x", shiftDirection: 1, side: "left" },
  right: { axis: "x", shiftDirection: -1, side: "left" },
  top: { axis: "y", shiftDirection: 1, side: "top" },
  bottom: { axis: "y", shiftDirection: -1, side: "top" },
}

export function offsetShrink() {
  let verticalCollisionBorder;
  let horizontalCollisionBorder;

  for (const { x, y } of getBodyData()) {
    // shift() can be executed only once for each border
    if (!verticalCollisionBorder) {
      verticalCollisionBorder = getCollisionBorder(x, undefined); 
      if (verticalCollisionBorder) shift(SHIFT_CONFIGS[verticalCollisionBorder]);
    }

    if (!horizontalCollisionBorder) {
      horizontalCollisionBorder = getCollisionBorder(undefined, y); 
      if (horizontalCollisionBorder) shift(SHIFT_CONFIGS[horizontalCollisionBorder]);
    }

    if (verticalCollisionBorder && horizontalCollisionBorder) break; 
  }
}

function shift({ axis, shiftDirection, side }) {
  getBodyData().forEach((data, i) => {
    const coordValue = data[axis];
    const element = getBodyElements[i];
    const newCoordValue = coordValue + step * shiftDirection;

    element.style[side] = `${newCoordValue}px`;
  })
  
  snapshot();
}


export function isNearOppositeBorders() {
  const { top, bottom, left, right, step } = boardData;

  return (
    (getBodyData().some(({ y }) => (y <= top + step) 
    && getBodyData().some(({ y }) => (y >= bottom - step)))) 
    ||
    ((getBodyData().some(({ x }) => (x <= left + step))) 
    && (getBodyData().some(({ x }) => (x >= right - step)))) 
  )
}





