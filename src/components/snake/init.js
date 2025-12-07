import { normalize, Color } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { getCenter } from "../board.js";

export let color, headElement, step;
export let speed;

export function spawn() {
  step = getMinSizeUnit() / 2; // Board shrinks half of sizeSlider.value from each side.



  color = new Color(document.querySelector('input[name="snake-color"]:checked').value);

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string, "neck");

  headElement = document.getElementById("head");
  speed = 1;
 
  snapshot();
}

function createSection(x, y, color, id="") {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = id;
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor = color;

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

export const data = {
  get body() { body },
  get bodyData() { bodyData },
  get headData() { headData },
}

export const speedUp = (accelar) => speed += accelar;