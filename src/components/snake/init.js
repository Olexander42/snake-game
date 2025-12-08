import { normalize, Color, roundTo } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { center as boardCenter } from "../board.js";


export let div, color, step;

export function spawn() {
  if (div && div.firstElementChild) div.replaceChildren(); // delete the previous snake

  color = new Color(document.querySelector('input[name="snake-color"]:checked').value);
  step = getMinSizeUnit();

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string, "neck");
  
  snapshot();
}

function createSection(x, y, color, id="") {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = id;
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor = color;

  if (!div) div = document.getElementById("snake");
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


export const direction = { "x": 1, "y": 0 };
export const newHeadData = { "x": null, "y": null, "rotation": 0 };
