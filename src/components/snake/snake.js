import Color from "../../common/Color.js";
import { normalize, roundTo } from "../../common/utils.js";
import { container } from "../../common/elements.js";
import { TIME_UNIT } from "../../common/constants.js";
import { data as boardData } from "../board.js";


let skinColor;
let headEl;
export let speed;

export function spawn() {
  const boardCenter = { 
    x: normalize(Math.round(container.clientWidth) / 2, boardData.step),
    y: normalize(Math.round(container.clientHeight) / 2, boardData.step), 
  }

  skinColor = new Color(document.querySelector('input[name="snake-color"]:checked').value);

  createSection(boardCenter.x, boardCenter.y, skinColor.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - boardData.step, boardCenter.y, skinColor.string, "neck");

  headEl = document.getElementById("head");
  speed = 1;
 
  snapshot();
}

export const div = document.getElementById("snake");

function createSection(x, y, color, id="") {
  const el = document.createElement('span');

  el.classList.add(`${"snake-section"}`);
  el.id = id;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.backgroundColor = color;

  div.append(el);
}

let body;
export let bodyData;
export let headData;

function snapshot() {
  body = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  body.forEach((el) => {
    const [x, y, rotation] = [parseInt(el.style.left), parseInt(el.style.top), el.style.rotate];
    const sectionData = { x, y, rotation };

    bodyData.push(sectionData);
  })

  headData = bodyData[0];
}

export const direction = {"x": 1, "y": 0};

export function calcNewHeadCoords() {   
  const newCoords = {
    x: headData.x + boardData.step * Math.sign(direction.x),
    y: headData.y + boardData.step * Math.sign(direction.y),
  } 

  return newCoords;
}

let headRotation = 0;

export function updateHeadRotation(rotation) { 
  headRotation += rotation ;
}

export function makeStep(coords) {
  headEl.style.left = `${coords.x}px`;
  headEl.style.top = `${coords.y}px`;
  headEl.style.rotate = `${headRotation}turn`;

  bodyFollows();
  snapshot();
}

function bodyFollows(i = 1) {
  const currentEl = body[i];
  const nextSection = bodyData[i - 1]; 

  currentEl.style.left = `${nextSection.x}px`;
  currentEl.style.top = `${nextSection.y}px`;
  currentEl.style.rotate = `${nextSection.rotate}px`;

  if (i < body.length - 1) bodyFollows(i + 1); // get rid of the recursion
}

export function isAteFood(foodCoords) {
  return headData.x === foodCoords.x && headData.y === foodCoords.y;
}

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







 






 