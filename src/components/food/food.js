import { TIME_UNIT } from "../common/constants.js";
import { getMinSizeUnit } from "../common/config.js";
import { normalize, getRandomInt } from "../common/utils.js";
import Color from "../common/Color.js";


const foodCoords = {};
let foodEl, colorManager, minSizeUnit;

export function spawn(boardData, snakeCoords) {
  foodEl = document.getElementById("food");

  const colorManager = colorManager.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] })
  colorManager = new colorManager(colorManager);
  foodEl.style.backgroundColor = colorManager.string; 

  minSizeUnit = getMinSizeUnit();

  teleport(boardData, snakeCoords);
}

export function teleport(boardData, snakeCoords) {
  foodCoords = generateRandomCoords(boardData, snakeCoords);

  foodEl.style.left = `${foodCoords.x}px`;
  foodEl.style.top = `${foodCoords.y}px`;
}


function generateRandomCoords(boardData, snakeCoords) {
  const { left, right, top, bottom } = boardData;
  const randomCoords = {}

  while (true) {
    randomCoords.x = normalize(getRandomInt(left, right), minSizeUnit);
    randomCoords.y = normalize(getRandomInt(top, bottom), minSizeUnit);
    
    if (!snakeCoords.some(({ x, y }) => randomCoords.x === x && randomCoords.y === y)) break;
  }

  return randomCoords;
}


export { generateRandomCoords }; // for testing
