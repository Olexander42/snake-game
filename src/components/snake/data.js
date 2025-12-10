import { normalize, Color, roundTo, deepCopy } from "../../common/utils.js";
import { getMinSizeUnit } from "../../common/config.js";
import { center as boardCenter } from "../board.js";



export let isAlive;
export let direction;
export let bodyElements, bodyData, headElement, headData;
export let headRotation;

export let snakeDiv;
export let step;

export function initData() {
  snakeDiv = document.getElementById("snake");
  direction = { "x": 1, "y": 0 };
  headRotation = 0;
  isAlive = true;
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

export const setHeadElement = (el) => headElement = el;
export const setHeadRotation = (rot) => headRotation += rot;
export const die = () => isALive = false;




