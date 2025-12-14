import { getMinSizeUnit } from "../../common/config.js";

import { getBodyElements, getBodyData, getHeadCoords, getDirection, headRotation, setIsAlive, step } from "./data.js";
import { getCollisionBorder } from "./shrinkManager.js"
import { snapshot } from "./snake.js"


export function makeStep() {
  const newHeadCoords =  {
    x: getHeadCoords().x + step * Math.sign(getDirection().x),
    y: getHeadCoords().y + step * Math.sign(getDirection().y)
  }

  if (!isCollision(newHeadCoords)) {
    moveHead(newHeadCoords);
    bodyFollows();
    snapshot();
  } else {
    setIsAlive(false);
  }
}

function isCollision(headCoords) {
  const isBorderCollision = getCollisionBorder(headCoords);

  const isHeadBodyCollision = getBodyData().some(({ x, y }) => {
    return headCoords.x === x && headCoords.y === y;
  })

  return isBorderCollision || isHeadBodyCollision;
}

function moveHead( { x, y }) {
  const headElement = getBodyElements()[0];

  headElement.style.left = `${x}px`; 
  headElement.style.top = `${y}px`;
  headElement.style.rotate = `${headRotation}turn`;
}

function bodyFollows() {
  getBodyData().forEach((sectionData, i) => {
    if (i < getBodyData().length - 1) {
      const nextSectionElement = getBodyElements()[i + 1];
      nextSectionElement.style.left = `${sectionData.x}px`;
      nextSectionElement.style.top = `${sectionData.y}px`;
    }
  })
}













