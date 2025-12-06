import Color from "../../common/Color.js";
import { normalize, roundTo } from "../../common/utils.js";
import { container, sizeInput } from "../../common/elements.js";
import { TIME_UNIT } from "../../common/constants.js";


let skinColor;
let headElement;
let step;
export let speed;

export function spawn() {
  step = parseInt(sizeInput.value) / 2; // because board shrinks half sizeInput.value from each side

  const boardCenter = { 
    x: normalize(Math.round(container.clientWidth) / 2, step),
    y: normalize(Math.round(container.clientHeight) / 2, step), 
  }

  skinColor = new Color(document.querySelector('input[name="snake-color"]:checked').value);

  createSection(boardCenter.x, boardCenter.y, skinColor.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, skinColor.string, "neck");

  headElement = document.getElementById("head");
  speed = 1;
 
  snapshot();
}

const div = document.getElementById("snake");

function createSection(x, y, color, id="") {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = id;
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor = color;

  div.append(section);
}

export let body, bodyData, headData;

export function snapshot() {
  body = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  body.forEach((section) => {
    const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
    const sectionData = { x, y, rotation };

    bodyData.push(sectionData);
  })

  headData = bodyData[0];
  JSON.stringify(bodyData, null, 2);
}

export const direction = {"x": 1, "y": 0};
export const newHeadData = {
  x: null,
  y: null,
  rotation: 0,
};

export function updateHeadCoords() {   
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

export const isAteFood = (foodCoords) => headData.x === foodCoords.x && headData.y === foodCoords.y;

const ACCELERATION = 0.25;

export function levelUp() { 
  speed += ACCELERATION;

  // Grow. 
  const oldTailEl = body[body.length - 1];
  if (oldTailEl.id === "tail") oldTailEl.id = ""; // TODO: try to get rid of this or move it

  const tailEl = oldTailEl.cloneNode(false);
  div.append(tailEl);

  tailEl.id = "tail";
  tailEl.style.zIndex = `-${body.length}`
  tailEl.style.backgroundColor = skinColor.changeColor({ changeL: body.length }); 

  snapshot();

  // Rescale body (tapering effect);
  let i = 0; 
  let scale = 0;

  body.forEach((el) => { 
    scale += 1 / (2 ** i); 
    el.style.scale = Math.min(`${roundTo(scale, 2)}`, 1); 
  })
}

const DESATURATION = 0.15;

export function greyout(duration) {
  let timeLeft = duration;
  let i = 0;
  let j = body.length + 1;

  skinColor.hslComponents.s *= DESATURATION; 

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    // sections greyout sequentially
    setTimeout(() => {
      const color = skinColor.changeColor({ changeL: i }); // The original lightness is preserved.
      const section = body[i];

      section.style.backgroundColor = color;

      i++;
      if (i < body.length) setTimeout(() => greyoutSection(ms), ms);  
    }, ms)
  }
  greyoutSection(0);
}

export const disappear = () => div.replaceChildren();











 






 