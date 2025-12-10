import { getMinSizeUnit } from "../../commmon/config.js";
import { bodyElements, bodyData, headData, direction, snapshot } from "./data.js";
import { data as boardData } from "../board.js";


let step;

export function calcNewHeadCoords() {  
  step ??= getMinSizeUnit();

  return {
    x: headData.x + step * Math.sign(direction.x),
    y: headData.y + step * Math.sign(direction.y)
  }
}

export function isCollision(coords) {
  const isHeadBodyCollision = bodyData.some(({ x, y }) => coords.x === x && coords.y === y);

  return (isHeadBodyCollision || getCollisionBorder(coords));
}

function getCollisionBorder({ x, y }) {
  const { left, right, top, bottom } = boardData;

  if (x < left) return "left";
  if (x > right) return "right";
  if (y < top) return "top";
  if (y > bottom) return "bottom";
}

/*

const SHIFT_CONFIGS = {
  left: { axis: "x", shiftDirection: 1, side: "left" },
  right: { axis: "x", shiftDirection: -1, side: "left" },
  top: { axis: "y", shiftDirection: 1, side: "top" },
  bottom: { axis: "y", shiftDirection: -1, side: "top" },
}

export function offsetShrink() {
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
  getBody.data.forEach((data, i) => {
    const coordValue = data[axis];
    const element = getBody.elements[i];
    const newCoordValue = coordValue + step * shiftDirection;
    element.style[side] = `${newCoordValue}px`;
  })

  snapshot();
}


export function isNearOppositeBorders() {
  const { top, bottom, left, right, step } = boardData;

  return (
    (getBody.data.some(({ y }) => (y <= top + step) 
    && getBody.data.some(({ y }) => (y >= bottom - step)))) 
    ||
    ((getBody.data.some(({ x }) => (x <= left + step))) 
    && (getBody.data.some(({ x }) => (x >= right - step)))) 
  )
}
*/




