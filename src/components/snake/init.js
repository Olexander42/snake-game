import { normalize, Color, roundTo, deepCopy } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { center as boardCenter } from "../board.js";


let direction = { "x": 1, "y": 0 };
let snakeDiv, bodyElements, bodyData, headElement, headData, newHeadCoords;
export let step;


export function spawn() {
  color = new Color(document.querySelector('input[name="snake-color"]:checked').value);
  step = getMinSizeUnit(); // TODO: eliminate the need of 'step' in this module

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string, "neck");

  headElement = document.getElementById("head");
  
  snapshot();

  isAlive = true;
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

export const getHeadRotation = () => headData.rotation;
export const setHeadRotation = (turn) => headData.rotation += turn;

export const getDirection = () => ({
  get x() { return direction.x },
  get y() { return direction.y },
});

export const setDirection = (newDir) => direction = newDir;