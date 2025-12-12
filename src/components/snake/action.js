import { roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";

import { getBodyElements, getBodyData, headRotation, colorManager, speedUp, snakeDiv, setIsAlive, } from "./data.js";
import { calcNewHeadCoords, isCollision } from "./collisionManager.js"
import { snapshot } from "./snake.js"


export function makeStep() {
  const newHeadCoords = calcNewHeadCoords();

  if (!isCollision(newHeadCoords)) {
    moveHead(newHeadCoords);
    bodyFollows();
  } else {
    setIsAlive(false);
  }
}

export function levelUp() {
  speedUp();
  grow();
  rescaleSections();
}

function moveHead(coords) {
  const headElement = getBodyElements()[0];

  headElement.style.left = `${coords.x}px`; 
  headElement.style.top = `${coords.y}px`;
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
  snapshot();
}

function grow() {
  const newTailElement = getBodyElements()[getBodyElements().length - 1].cloneNode(false);

  if (newTailElement.id === "head") newTailElement.id = "";
  newTailElement.style.zIndex = `-${getBodyElements().length}`; // correct overlapping 
  newTailElement.style.backgroundColor = colorManager.changeColor({ changeL: getBodyElements().length }); // Each section gets progressively lighter.
  
  snakeDiv.append(newTailElement);
  snapshot();
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












