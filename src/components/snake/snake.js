import { normalize, Color, roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { center as boardCenter } from "../board.js";


export let div, color, step, headElement;

export function spawn() {
  removePrevSnake();

  color = new Color(document.querySelector('input[name="snake-color"]:checked').value);
  step = getMinSizeUnit(); // TODO: eliminate the need of 'step' in this module

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string, "neck");

  headElement = document.getElementById("head");
  
  snapshot();
}

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


let body, bodyData, headData;

export function snapshot() {
  body = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  body.forEach((section) => {
    const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
    const sectionData = { x, y, rotation };

    bodyData.push(sectionData);
  })

  headData = bodyData[0];
}

export const getBody = () => Object.freeze(body);
export const getBodyData = () => Object.freeze(bodyData);
export const getHeadData = () => Object.freeze(headData);


export function makeStep(newHeadCoords) {
  headElement.style.left = `${newHeadCoords.x}px`;
  headElement.style.top = `${newHeadCoords.y}px`;

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


export const isAteFood = (foodCoords) => headData.x === foodCoords.x && headData.y === foodCoords.y;

export function levelUp() { 
  grow();
  snapshot();
  rescaleSections();
}

function grow() {
  const oldTailElement = body[body.length - 1];
  if (oldTailElement.id === "tail") oldTailElement.id = ""; // TODO: try to get rid of this or move it

  const newTailElement = oldTailElement.cloneNode(false);
  newTailElement.id = "tail"; // why do we need this id?
  newTailElement.style.zIndex = `-${body.length}`; // correct overlapping 
  newTailElement.style.backgroundColor = color.changeColor({ changeL: body.length }); // Each section gets progressively lighter.
  div.append(newTailElement);
}

function rescaleSections() {
  // Tapering effect.
  let scale = 0;
  let i = 0; 
  
  body.forEach((section) => { 
    scale += 1 / (2 ** i); 
    section.style.scale = Math.min(`${roundTo(scale, 2)}`, 1); 
  })
}


const DESATURATION = 0.15;

export function greyout(duration) {
  let timeLeft = duration;
  let i = 0;
  let j = body.length + 1;

  color.hslComponents.s *= DESATURATION; 

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    // sections greyout sequentially
    setTimeout(() => {
      const color = color.changeColor({ changeL: i }); // The original lightness is preserved.
      const section = body[i];

      section.style.backgroundColor = color;

      i++;
      if (i < body.length) setTimeout(() => greyoutSection(ms), ms);  
    }, ms)
  }
  greyoutSection(0);
}

function removePrevSnake() {
  const isSnakeExists = div && div.firstElementChild;
  if (isSnakeExists) div.replaceChildren(); 
}



