import { step, getBodyElements, getBodyData, getHeadCoords, getDirection, setBorders, getBorders } from "./data.js";
import { snapshot } from "./snake.js";


export function isCollision(headCoords) {
  const isHeadBodyCollision = getBodyData().some(({ x, y }) => {
    headCoords.x === x && headCoords.y === y
  });

  return (isHeadBodyCollision || getCollisionBorder(headCoords));
}

function getCollisionBorder( { x, y }) {
  const { left, right, top, bottom } = getBorders();

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

export function offsetShrink(borders) {
  setBorders(borders);

  let verticalCollisionBorder;
  let horizontalCollisionBorder;

  for (const { x, y } of getBodyData()) {
    // We check one axis at a time to filter the relevant pair of borders.
    // shift() can be executed only once for each *CollisionBorder.
    if (!verticalCollisionBorder) {
      verticalCollisionBorder = getCollisionBorder({ "x": x, "y": undefined }); 
      if (verticalCollisionBorder) shift(SHIFT_CONFIGS[verticalCollisionBorder]);
    }

    if (!horizontalCollisionBorder) {
      horizontalCollisionBorder = getCollisionBorder({ "x": undefined, "y": y }); 
      if (horizontalCollisionBorder) shift(SHIFT_CONFIGS[horizontalCollisionBorder]);
    }

    if (verticalCollisionBorder && horizontalCollisionBorder) break; 
  }
}

function shift({ axis, shiftDirection, side }) {
  getBodyData().forEach((coords, i) => {
    const coordValue = coords[axis];
    const section = getBodyElements()[i];
    const newCoordValue = coordValue + step * shiftDirection;

    section.style[side] = `${newCoordValue}px`;
  })
  
  snapshot();
}

export function isNearOppositeBorders() {
  const { top, bottom, left, right } = getBorders();
 
  return (
    ((getBodyData().some(({ x }) => (x <= left + step))) 
    && (getBodyData().some(({ x }) => (x >= right - step))))
    || 
    (getBodyData().some(({ y }) => (y <= top + step) 
    && getBodyData().some(({ y }) => (y >= bottom - step)))) 
  )
}





