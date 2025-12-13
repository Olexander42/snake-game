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
  // Due to performance issues, we transition opacity of the ::before pseudo-element, not the food element itself.
  foodEl.style.setProperty("--pseudo-color", colorManager.string); // Sync ::before and the main element color.
  console.log(colorManager.string);
  const newRandomColor = Color.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] });
  foodEl.style.backgroundColor = newRandomColor;

  // The change is hidden by the fully opaque pseudo-element.
  foodEl.style.setProperty("--pseudo-transition", 'none'); 
  foodEl.style.setProperty("--pseudo-opacity", 1); 
  
  foodEl.offsetLeft; // force repaint

  // Increasingly transparent pseudo-element gradually reveals the new color of the food element underneath.
  foodEl.style.setProperty("--pseudo-transition", `opacity ${TRANSITION_DURATION / MS_IN_SECOND}s linear`); 
  foodEl.style.setProperty("--pseudo-opacity", 0);

  colorManager.string = newRandomColor; 
  setTimeout(() => transitionColors(), TRANSITION_DURATION); 
}

function fadeIn() {
  foodEl.style.transition = `opacity ${TRANSITION_DURATION / MS_IN_SECOND}s linear`;
  requestAnimationFrame(() => foodEl.style.opacity = 1); 
  foodEl.addEventListener('transitionend', () => foodEl.style.transition = 'none');
}

