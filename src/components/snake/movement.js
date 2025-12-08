import { body, bodyData, headData, newHeadData, step, snapshot, direction  } from "./init.js";

export function calcNewHeadCoords() {   
  newHeadData.x = headData.x + step * Math.sign(direction.x);
  newHeadData.y = headData.y + step * Math.sign(direction.y);
}

let headElement;

export function makeStep() {
  if (!headElement) headElement = document.getElementById("head");

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

