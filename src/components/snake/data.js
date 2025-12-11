import { deepCopy } from "../../common/utils.js";
import Color from "../../common/Color.js";

export let isAlive;
export let snakeDiv;
export let bodyElements, bodyData;
export let direction, headRotation;
export let speed;
export let colorManager;

let boardData;

export function initData() {
  isAlive = true;
  snakeDiv = document.getElementById("snake");
  direction = { "x": 1, "y": 0 };
  headRotation = 0;
  speed = 1;

  const color = document.querySelector('input[name="snake-color"]:checked').value;
  colorManager = new Color(color);
}

export function snapshot() {
  bodyElements = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  bodyElements.forEach((section) => {
    const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
    const sectionData = { x, y, rotation };

    bodyData.push(sectionData);
  })
}

export const headCoords = {
  get x() { return bodyData[0].x },
  get y() { return bodyData[0].y },
}

export const setHeadRotation = (rot) => headRotation += rot;

export const speedUp = () => {
  const ACCELARATION = 0.15;
  speed += ACCELARATION;
}

export const setBoardData = (data) => boardData = data;
export const getBoardData = () => boardData;

export const die = () => isAlive = false;



