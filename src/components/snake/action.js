import { roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";

import { snakeDiv, bodyElements, bodyData, headRotation, colorManager, snapshot, speedUp, die } from "./snake.js";
import { calcNewHeadCoords, isCollision } from "./collisionManager.js"


export function makeStep() {
  const newHeadCoords = calcNewHeadCoords();
  if (!isCollision(newHeadCoords)) {
    moveHead(newHeadCoords);
    bodyFollows();

    snapshot();
  } else die();
}

export function levelUp() {
  speedUp();
  grow();
  rescaleSections();
}

function moveHead(coords) {
  const headElement = bodyElements[0];

  headElement.style.left = `${coords.x}px`; 
  headElement.style.top = `${coords.y}px`;
  headElement.style.rotate = `${headRotation}turn`;
}

function bodyFollows() {
  bodyData.forEach((sectionData, i) => {
    if (i < bodyData.length - 1) {
      const nextSectionElement = bodyElements[i + 1];

      nextSectionElement.style.left = `${sectionData.x}px`;
      nextSectionElement.style.top = `${sectionData.y}px`;
    }
  })
}

function grow() {
  const newTailElement = bodyElements[bodyElements.length - 1].cloneNode(false);

  if (newTailElement.id === "head") newTailElement.id = "";
  newTailElement.style.zIndex = `-${bodyElements.length}`; // correct overlapping 
  newTailElement.style.backgroundColor = colorManager.changeColor({ changeL: bodyElements.length }); // Each section gets progressively lighter.
  
  snakeDiv.append(newTailElement);
  snapshot();
}

function rescaleSections() {
  // Tapering effect.
  const length = bodyElements.length + 1; // The last section always ends up with scale 0.5. 
  const MAX_SCALE = 1;

  bodyElements.forEach((section, i) => { 
    if (i !== 0) { // exclude head
      const distance = length - i;
      const scale = MAX_SCALE - 1 / distance;

      section.style.scale = `${roundTo(scale, 2)}`; 
    }
  })
}












