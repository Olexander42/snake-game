import { deepCopy } from "../../common/utils.js";
import Color from "../../common/Color.js";
import { getMinSizeUnit } from "../../common/config.js";


export let isAlive;
export const setIsAlive = (bool) => {
  if (typeof bool === 'boolean') isAlive = bool; 
  else throw new TypeError(`Expected a boolean, but ${typeof bool} was provided`);
}

const direction = { "x": null, "y": null };
export const setDirection = (x, y) => [direction.x, direction.y] = [x, y];
export const getDirection = () => ({...direction});

export let headRotation;
export const setHeadRotation = (turn) => {
  if (typeof turn === 'number') headRotation += turn;
  else throw new TypeError(`Expected a number, but ${typeof bool} was provided`);
}
export const resetHeadRotation = () => headRotation = 0;

export let speed;
const ACCELERATION = 0.25
export const speedUp = () => speed += ACCELERATION;
export const resetSpeed = () => speed = 1;

const bodyElements = [];
export const updateBodyElements = () => {
  bodyElements.splice(0, bodyElements.length);
  bodyElements.push(...document.querySelectorAll(".snake-section"));
}
export const getBodyElements = () => bodyElements.slice();

const bodyData = [];
export const bodyDataAdd = (x, y) => {
  if (typeof x === 'number' && typeof y === 'number') bodyData.push({ x, y });
  else throw new TypeError(`Expected numbers, but ${x} of type ${typeof x} and ${y} of ${typeof y} was provided`);
}
export const getBodyData = () => deepCopy(bodyData);
export const emptyBodyData = () => bodyData.splice(0, bodyData.length);

export const getHeadCoords = () => ({
  x: bodyData[0].x,
  y: bodyData[0].y
})

export let step;
export const initStep = () => step = getMinSizeUnit();

export let snakeDiv;
export const initSnakeDiv = () => snakeDiv = document.getElementById("snake");

export let colorManager;
export const initColorManager = (color) => colorManager = new Color(color);

let borders;
export const setBorders = (data) => borders = data;
export const getBorders = () => ({...borders});
