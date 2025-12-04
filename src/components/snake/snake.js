import Color from "../../common/Color.js";
import { normalize, roundTo } from "../../common/utils.js";
import { container } from "../../common/elements.js";
import { TIME_UNIT } from "../../common/constants.js";
import { data as boardData } from "../board.js";

export const div = document.getElementById("snake");
export let speed;

const ACCELERATION = 0.25;

const DESATURATION = 0.15;

const direction = {"x": 1, "y": 0};

let headEl;
let headRotation;
let skinColor;

export function spawn() {
  const boardCenter = { 
    x: normalize(Math.round(container.clientWidth) / 2, boardData.step),
    y: normalize(Math.round(container.clientHeight) / 2, boardData.step), 
  }

  skinColor = new Color(document.querySelector('input[name="color"]:checked').value);

  createSection(boardCenter.x, boardCenter.y, skinColor.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - boardData.step, boardCenter.y, skinColor.string, "neck"); // ❌

  headEl = document.getElementById("head");

  headEl.style.scale = `${1}`; 
  document.getElementById("neck").style.scale = `${0.75}`; // ❌

  speed = 1;
  headRotation = 0;

  //snapshot();
}

/*

export function calcHeadNewCoords() {    
  const headData = bodyData[0];
  const [currentX, currentY] = [headData.x, headData.y];

  const headNewCoords = {}
  headNewCoords.x = currentX + boardData.step * Math.sign(direction.x);
  headNewCoords.y = currentY + boardData.step * Math.sign(direction.y);

  return headNewCoords;
}

export function makeStep(coords) {
  headEl.style.left = `${coords.x}px`;
  headEl.style.top = `${coords.y}px`;
  headEl.style.rotate = `${headRotation}turn`;

  bodyFollows();
  snapshot();
}

*/
function createSection(x, y, color, id="") {
  const el = document.createElement('span');

  el.classList.add("block");
  el.classList.add(`${"snake-section"}`);
  el.id = id;

  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.backgroundColor = color;

  div.append(el);
}

function snapshot() {
  body = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  body.forEach((el) => {
    const [x, y, rotation] = [parseInt(el.style.left), parseInt(el.style.top), el.style.rotate];
    const sectionData = {x, y, rotation};

    bodyData.push(sectionData);
  })
}
/*

function bodyFollows(i = 1) {
  /* 'Neck' takes position of 'headEl',
  the next-after-neck section takes position of 'neck',
  and so on. 
  const currentSection = bodyData[i];
  const nextSection = bodyData[i - 1];

  currentSection.style.left = `${nextSection.x}px`;
  currentSection.style.top = `${nextSection.y}px`;
  currentSection.style.rotate = nextSection.rotation;

  if (i < bodyData.length - 1) bodyFollows(i + 1);
}

export function isAteFood(foodCoords) {
  return headData.x === foodCoords.x && headData.y === foodCoords.y;
}

export function levelUp() { 
  speed += ACCELERATION;
  grow();
  snapshot();
  rescaleBody();
}

function grow() {
  const oldTailEl = body[body.length - 1];
  if (oldTailEl.id === "tail") oldTailEl.id = "";

  tailEl = oldTailEl.cloneNode(false);
  tailEl.id = "tail";
  tailEl.style.zIndex = `-${body.length}`
  tailEl.style.backgroundColor = skinColor.changeColor({ changeL: body.length }); 
  div.append(tailEl);
}

function rescaleBody() {
  // create tapering effect
  const length = body.length;
  let i = length - 1; // tail
  let j = 1; // neck
  let scale = 0;

  // each segment from tail to neck gets decreasingly smaller
  function rescaleSection() { 
    scale += 1 / (2 ** j); 
    body[i].style.scale = `${roundTo(scale, 2)}`;

    i--;
    j++;
    if (i > 0) rescaleSection();  
  }
  rescaleSection();
}



 
  greyout(duration) {
    let timeLeft = duration;
    let i = 0;
    let j = body.length + 1;
  
    color.hslComponents.s *= Snake.DESATURATION; 

    const greyoutSection = (ms) => {
      ms = timeLeft / ( 2 ** (j - i));
      timeLeft -= ms;
      // sections greyout sequentially
      setTimeout(() => {
        const color = color.changeColor({ changeL: i }); // the original lightness is preserved
        const section = body[i];
  
        section.style.backgroundColor = color;

        i++;
        if (i < body.length) setTimeout(() => greyoutSection(ms), ms);  
      }, ms)
    }
    greyoutSection(0);
  }
}

export function updateHeadRotation(value) {
  return headRotation += value;
}

*/



 