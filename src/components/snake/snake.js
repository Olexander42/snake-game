import { roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { initData, colorManager, snakeDiv, bodyElements, bodyData, headCoords, headRotation, snapshot, speedUp, die } from "./data.js";
import { calcNewHeadCoords, isCollision } from "./collisionManager.js"

let step; // temp

export function spawn(boardCenter) {
  initData();

  step = getMinSizeUnit(); // TODO: eliminate the need of 'step' in this module

  createSection(boardCenter.x, boardCenter.y, colorManager.changeColor({ changeL: -2 }), "head"); // TODO: createHead()?

  snapshot();


  
  //createSection(boardCenter.x - step, boardCenter.y, colorManager.string, "neck");
}

export function makeStep() {
  const newHeadCoords = calcNewHeadCoords();
  if (!isCollision(newHeadCoords)) {
    moveHead(newHeadCoords);
    bodyFollows();

    snapshot();
  } else die();
}

export const isAteFood = ({ foodX, foodY }) => headCoords.x === foodX && headCoords.y === foodY;

export function levelUp() {
  //speedUp();
  grow();
  rescaleSections();
}

export function greyout(duration) {
  const DESATURATION = 0.15

  let timeLeft = duration;
  let i = 0;
  let j = bodyElements.length + 1;

  colorManager.hslComponents.s *= DESATURATION;

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    setTimeout(() => {
      const color = colorManager.changeColor({ changeL: i }); // The original lightness is preserved.
      const section = bodyElements[i];

      section.style.backgroundColor = color;

      i++;
      if (i < bodyElements.length) setTimeout(() => greyoutSection(ms), ms);  
    }, ms)
  }
  greyoutSection(0);
}

export const emptyOut = () => snakeDiv.replaceChildren();

function createSection(x, y, color, id="") {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = id;
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor = color;

  snakeDiv.append(section);
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
      nextSectionElement.style.rotate = `${sectionData.rotate}px`;
    }
  })
}

function grow() {
  const oldTailElement = bodyElements[bodyElements.length - 1];
  //if (oldTailElement.id === "head") oldTailElement.id = ""; // TODO: try to get rid of this or move it

  const newTailElement = oldTailElement.cloneNode(false);
  if (newTailElement.id = "tail") newTailElement.id = ""; // why do we need this id?
  newTailElement.style.zIndex = `-${bodyElements.length}`; // correct overlapping 
  newTailElement.style.backgroundColor = colorManager.changeColor({ changeL: bodyElements.length }); // Each section gets progressively lighter.
  snakeDiv.append(newTailElement);

  snapshot();
}

function rescaleSections() {
  // Tapering effect from tail to head.
  // Minimum scale is 0.5 to avoid gaps between sections.
  const j = bodyElements.length + 1;
  let scale = 0;

  bodyElements.forEach((section, i) => { 
    if (i !== 0) { // exclude head
      scale = 1 - 1 / (j - i); 
      section.style.scale = `${roundTo(scale, 3)}`; 
    }
  })
}










