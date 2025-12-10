import { normalize, Color, roundTo, deepCopy } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { center as boardCenter } from "../board.js";


export let step, headElement;

export function spawn() {
  removePrevSnake();

  color = new Color(document.querySelector('input[name="snake-color"]:checked').value);
  step = getMinSizeUnit(); // TODO: eliminate the need of 'step' in this module

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string, "neck");

  headElement = document.getElementById("head");
  
  snapshot();
}

function removePrevSnake() {
  const isSnakeExists = div && div.firstElementChild;
  if (isSnakeExists) div.replaceChildren(); 
}

let div;

function createSection(x, y, color, id="") {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = id;
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor = color;

  div ??= document.getElementById("snake");
  div.append(section);
}

let bodyElements, bodyData, headData;

export function snapshot() {
  bodyElements = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  bodyElements.forEach((section) => {
    const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
    const sectionData = { x, y, rotation };

    bodyData.push(sectionData);
  })

  headData = bodyData[0];
}

export const getHead = {
  get element() { return headElement.cloneNode(false) },
  get data() { return deepcopy(headData) },
}

export const getBody = {
  get elements() { return [...bodyElements]},
  get data() { return deepcopy(bodyData) },
}

let newHeadCoords;
const direction = { "x": 1, "y": 0 };

export function calcNewHeadCoords() {  
  step ??= getMinSizeUnit();

  newHeadCoords = {
    x: getHead.data.x + step * Math.sign(direction.x),
    y: getHead.data.y + step * Math.sign(direction.y),
  }
}

export function makeStep(newHeadCoords) {
  headElement.style.left = `${newHeadCoords.x}px`;
  headElement.style.top = `${newHeadCoords.y}px`;

  bodyFollows();
  snapshot();
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
  div.append(newTailElement);

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


const DESATURATION = 0.15;

export function greyout(duration) {
  let timeLeft = duration;
  let i = 0;
  let j = bodyElements.length + 1;

  color.hslComponents.s *= DESATURATION; 

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    // sections greyout sequentially
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






