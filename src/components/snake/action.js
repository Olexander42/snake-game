import { roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";

import { getBodyElements, getBodyData, getHeadCoords, getDirection, headRotation, colorManager, speedUp, snakeDiv, setIsAlive, step } from "./data.js";
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

export function levelUp() {
  grow();
  speedUp();
  snapshot();
  rescaleSections();
}

function isCollision(headCoords) {
  const isHeadBodyCollision = getBodyData().some(({ x, y }) => {
    return headCoords.x === x && headCoords.y === y;
  })

  return isHeadBodyCollision || getCollisionBorder(headCoords);
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

function grow() {
  const newTailElement = getBodyElements()[getBodyElements().length - 1].cloneNode(false);

  if (newTailElement.id === "head") newTailElement.id = "";
  newTailElement.style.zIndex = `-${getBodyElements().length}`; // correct overlapping 
  newTailElement.style.backgroundColor = colorManager.changeColor({ changeL: getBodyElements().length }); // Each section gets progressively lighter.
  
  snakeDiv.append(newTailElement);
  console.log(getBodyData());
}

function rescaleSections() {
  // Tapering effect.
  const length = getBodyElements().length + 1; // The last section always ends up with scale 0.5. 
  const MAX_SCALE = 1;

  getBodyElements().forEach((section, i) => { 
    if (i !== 0) { // exclude head
      const distance = length - i;
      const scale = MAX_SCALE - 1 / distance;

      section.style.scale = `${roundTo(scale, 2)}`; 
    }
  })
}












