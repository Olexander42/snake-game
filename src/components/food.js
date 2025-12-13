import { TIME_UNIT } from "../common/constants.js";
import { getMinSizeUnit } from "../common/config.js";
import { normalize, getRandomInt } from "../common/utils.js";
import Color from "../common/Color.js";


let foodCoords;
export const getFoodCoords = () => ({...foodCoords});

let foodEl, colorManager, minSizeUnit;

const TRANSITION_DURATION = 2000;
const MS_IN_SECOND = 1000;

export function spawn(borders, snakeCoords) {
  foodEl = document.getElementById("food");

  colorManager = new Color(Color.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] }));
  foodEl.style.backgroundColor = colorManager.string; 

  minSizeUnit = getMinSizeUnit();

  teleport(borders, snakeCoords);
  fadeIn();
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

export function transitionColors(ms=TRANSITION_DURATION) { 
  // Due to performance issues, we transition opacity of the ::before pseudo-foodEl, not the food foodEl itself.
  foodEl.style.setProperty("--pseudo-colorManager", colorManager); // sync ::before and main foodEl colorManager
  
  const newRandomColor = colorManager.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] });
  foodEl.style.backgroundColor = newRandomColor; // Change the main foodEl colorManager.

  // The change is hidden by the fully opaque pseudo-foodEl.
  foodEl.style.setProperty("--pseudo-transition", 'none'); 
  foodEl.style.setProperty("--pseudo-opacity", 1); 
  
  foodEl.offsetLeft; // force repaint

  // Increasingly transparent pseudo-foodEl gradually reveals the new colorManager of the food foodEl underneath.
  foodEl.style.setProperty("--pseudo-transition", `opacity ${TRANSITION_DURATION / 1000}s linear`); 
  foodEl.style.setProperty("--pseudo-opacity", 0);

  colorManager = newRandomColor; 
  setTimeout(() => transitionColors(), TRANSITION_DURATION); 
}

function fadeIn() {
  foodEl.style.transition = `opacity ${TRANSITION_DURATION / MS_IN_SECOND}s linear`;
  requestAnimationFrame(() => foodEl.style.opacity = 1); 
  foodEl.addEventListener('transitionend', () => foodEl.style.transition = 'none');
}


export { generateRandomCoords }; // for testing
