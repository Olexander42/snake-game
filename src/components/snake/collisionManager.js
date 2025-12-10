import { getBody, getHead, newHeadCoords, snapshot } from "./init.js";
import { getDirection } from "./controls.js";
import { data as boardData } from "../board.js";


let step;

function calcNewHeadCoords() {  
  step ??= getMinSizeUnit();

  newHeadCoords = {
    x: getHead.data.x + step * Math.sign(getDirection().x),
    y: getHead.data.y + step * Math.sign(getDirection().y),
  }
}

export function checkCollision(newHeadCoords) {
  const isHeadBodyCollision = getBody.data.some(({ x, y }) => newHeadCoords.x === x && newHeadCoords.y === y);

  return isHeadBodyCollision || getCollisionBorder();
}

function getCollisionBorder(x = newHeadData.x, y = newHeadData.y) {
  const { left, right, top, bottom } = boardData;

  if (x < left) return "left";
  if (x > right) return "right";
  if (y < top) return "top";
  if (y > bottom) return "bottom";
}




