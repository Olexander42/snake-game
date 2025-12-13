import { TIME_UNIT } from "../common/constants.js";
import { getMinSizeUnit } from "../common/config.js";
import { normalize, getRandomInt } from "../common/utils.js";
import Color from "../common/Color.js";


const foodCoords = {};
let foodEl, colorManager, minSizeUnit;

export function spawn(borders, snakeCoords) {
  foodEl = document.getElementById("food");

  const colorManager = colorManager.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] })
  colorManager = new colorManager(colorManager);
  foodEl.style.backgroundColor = colorManager.string; 

  minSizeUnit = getMinSizeUnit();

  teleport(borders, snakeCoords);
}

export function teleport(borders, snakeCoords) {
  foodCoords = generateRandomCoords(borders, snakeCoords);

  foodEl.style.left = `${foodCoords.x}px`;
  foodEl.style.top = `${foodCoords.y}px`;
}


function generateRandomCoords(borders, snakeCoords) {
  const { left, right, top, bottom } = borders;
  const randomCoords = {}

  while (true) {
    randomCoords.x = normalize(getRandomInt(left, right), minSizeUnit);
    randomCoords.y = normalize(getRandomInt(top, bottom), minSizeUnit);
    
    if (!snakeCoords.some(({ x, y }) => randomCoords.x === x && randomCoords.y === y)) break;
  }

  return randomCoords;
}


export { generateRandomCoords }; // for testing
