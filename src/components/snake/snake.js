import { deepCopy } from "../../common/utils.js";
import Color from "../../common/Color.js";

export let isAlive;
export let snakeDiv;
export let bodyElements, bodyData;
export let direction, headRotation;
export let colorManager;
export let speed;

let boardData;

export function init(center) {
  isAlive = true;
  direction = { "x": 1, "y": 0 };
  headRotation = 0;
  speed = 1;

  const color = document.querySelector('input[name="snake-color"]:checked').value;
  colorManager = new Color(color);

  createHead(center);
}

export function snapshot() {
  bodyElements = [...document.querySelectorAll(".snake-section")];
  bodyData = [];

  bodyElements.forEach((section) => {
    const [x, y] = [parseInt(section.style.left), parseInt(section.style.top)]
    bodyData.push({ x, y });
  })
}

export function greyout(duration) {
  const DESATURATION = 0.15
  colorManager.hslComponents.s *= DESATURATION;

  let timeLeft = duration;
  let i = 0;
  let j = bodyElements.length + 1; // eliminate the need of +1

  const greyoutSection = (ms) => {
    ms = timeLeft / ( 2 ** (j - i));
    timeLeft -= ms;
    setTimeout(() => {
      const color = colorManager.changeColor({ changeL: i }); // The original lightness is preserved.
      const section = bodyElements[i];
      section.style.backgroundColor = color;

      i++;
      if (i < bodyElements.length) setTimeout(() => greyoutSection(ms), ms);  
    }, ms)
  }
  greyoutSection(0);
}

export const headCoords = {
  get x() { return bodyData[0].x },
  get y() { return bodyData[0].y },
}

export function speedUp() {
  const ACCELERATION = 0.25;
  speed += ACCELERATION;
}

export const initDiv = () => snakeDiv = document.getElementById("snake");

export const setBoardData = (data) => boardData = data;
export const getBoardData = () => boardData;

export const setHeadRotation = (turn) => headRotation += turn;

export const isAteFood = ({ foodX, foodY }) => headCoords.x === foodX && headCoords.y === foodY; 

export const die = () => isAlive = false;
export const emptyOut = () => snakeDiv.replaceChildren();

function createHead({ x, y }) {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = "head";
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor =  colorManager.changeColor({ changeL: -2 });

  snakeDiv.append(section);
  snapshot();
}






