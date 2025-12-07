import { body, bodyData, headData, headElement, step, snapshot } from "./init.js";


export const direction = {"x": 1, "y": 0};
export const newHeadData = {
  x: null,
  y: null,
  rotation: 0,
};

export function calcNewHeadCoords() {   
  newHeadData.x = headData.x + step * Math.sign(direction.x);
  newHeadData.y = headData.y + step * Math.sign(direction.y);
}

export function makeStep() {
  headElement.style.left = `${newHeadData.x}px`;
  headElement.style.top = `${newHeadData.y}px`;
  headElement.style.rotate = `${newHeadData.rotation}turn`;

  bodyFollows();
  snapshot();
}

function bodyFollows(i = 1) {
  const currentSection = body[i];
  const nextSectionData = bodyData[i - 1]; 

  currentSection.style.left = `${nextSectionData.x}px`;
  currentSection.style.top = `${nextSectionData.y}px`;
  currentSection.style.rotate = `${nextSectionData.rotate}px`;

  if (i < body.length - 1) bodyFollows(i + 1); // get rid of the recursion
}

