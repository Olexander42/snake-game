import { body, bodyData, headData, snapshot } from "./init.js";
import { direction } from "./controls.js";
import { data as boardData } from "../board.js";


let step;

function calcNewHeadCoords() {  
  step ??= getMinSizeUnit();

  const newHeadCoords = {
    x: headData.x + step * Math.sign(direction.x),
    y: headData.y + step * Math.sign(direction.y),
  }

  return newHeadCoords;
}

export function checkCollision(newHeadCoords) {
  const isHeadBodyCollision = bodyData.some(({ x, y }) => newHeadCoords.x === x && newHeadCoords.y === y);

  return isHeadBodyCollision || getCollisionBorder();
}

function getCollisionBorder(x = newHeadData.x, y = newHeadData.y) {
  const { left, right, top, bottom } = boardData;

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

export function offsetShrink(data) {
  let verticalCollisionBorder;
  let horizontalCollisionBorder;

  for (const { x, y } of bodyData) {
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
  bodyData.forEach((data, i) => {
    const coord = data[axis];
    const el = body[i];
    const newCoord = coord + step * shiftDirection;
    el.style[side] = `${newCoord}px`;
  })

  snapshot();
}


export function isNearOppositeBorders() {
  const { top, bottom, left, right, step } = boardData;

  return (
    (bodyData.some(({ y }) => (y <= top + step) 
    && bodyData.some(({ y }) => (y >= bottom - step)))) 
    ||
    ((bodyData.some(({ x }) => (x <= left + step))) 
    && (bodyData.some(({ x }) => (x >= right - step)))) 
  )
}

