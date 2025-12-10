import { roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { bodyElements, bodyData, headElement, setHeadElement, headRotation, initData, snapshot } from "./data.js";
import { calcNewHeadCoords, isCollison } from "./collisionControl.js"

let step; // temp

export function spawn() {
  initData();

  color = new Color(document.querySelector('input[name="snake-color"]:checked').value);
  step = getMinSizeUnit(); // TODO: eliminate the need of 'step' in this module

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string, "neck");
  setHeadElement(document.getElementById("head"));
  
  snapshot();
}

function createSection(x, y, color, id="") {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = id;
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor = color;

  snakeDiv.append(section);
}

export function makeStep() {
  const newHeadCoords = calcNewHeadCoords();
  if (!isCollison(newHeadCoords)) {
    moveHead(newHeadCoords);
    bodyFollows();

    snapshot();
  }
}

function moveHead(coords) { 
  headElement.style.left = `${coords.x}px`; 
  headElement.style.top = `${coords.y}px`;
  headElement.style.rotation = `${headRotation}px`;
}

function bodyFollows(i = 1) {
  const currentSection = bodyElements[i];
  const nextSectionData = bodyData[i - 1]; 

  currentSection.style.left = `${nextSectionData.x}px`;
  currentSection.style.top = `${nextSectionData.y}px`;
  currentSection.style.rotate = `${nextSectionData.rotate}px`;

  if (i < bodyElements.length - 1) bodyFollows(i + 1); // get rid of the recursion
}


export function grow() {
  const oldTailElement = bodyElements[bodyElements.length - 1];
  if (oldTailElement.id === "tail") oldTailElement.id = ""; // TODO: try to get rid of this or move it

  const newTailElement = oldTailElement.cloneNode(false);
  newTailElement.id = "tail"; // why do we need this id?
  newTailElement.style.zIndex = `-${bodyElements.length}`; // correct overlapping 
  newTailElement.style.backgroundColor = color.changeColor({ changeL: bodyElements.length }); // Each section gets progressively lighter.
  snakeDiv.append(newTailElement);

  snapshot();
  rescaleSections();
}

function rescaleSections() {
  // Tapering effect.
  let scale = 0;
  let i = 0; 
  
  bodyElements.forEach((section) => { 
    scale += 1 / (2 ** i); 
    section.style.scale = Math.min(`${roundTo(scale, 2)}`, 1); 
  })
}

export function greyout(duration) {
  const DESATURATION = 0.15

  let timeLeft = duration;
  let i = 0;
  let j = bodyElements.length + 1;

  color.hslComponents.s *= DESATURATION;

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    setTimeout(() => {
      const color = color.changeColor({ changeL: i }); // The original lightness is preserved.
      const section = bodyElements[i];

      section.style.backgroundColor = color;

      i++;
      if (i < bodyElements.length) setTimeout(() => greyoutSection(ms), ms);  
    }, ms)
  }
  greyoutSection(0);
}

export const emptyOut = () => snakeDiv.replaceChildren();






