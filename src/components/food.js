import { food as element } from "../common/elements.js";
import { getMinSizeUnit } from "../common/config.js";
import { normalize, getRandomInt, Color } from "../common/utils.js";
import { TIME_UNIT } from "../common/constants.js";
import { data as boardData } from "./board.js";


let color, minSizeUnit;

export function spawn(occupiedCoords) {
  color = new Color(Color.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] }));
  element.style.backgroundColor = color.string; 

  teleport(occupiedCoords);
  fadeIn()
}

export function teleport(occupiedCoords) {
  const randomCoords = generateRandomCoords(occupiedCoords);

  element.style.left = `${randomCoords.x}px`;
  element.style.top = `${randomCoords.y}px`;
}

function generateRandomCoords(occupiedCoords) {
  const minSizeUnit = getMinSizeUnit();
  const { left, right, top, bottom } = boardData;
  const randomCoords = {}

  while (true) {
    randomCoords.x = normalize(getRandomInt(left, right), minSizeUnit);
    randomCoords.y = normalize(getRandomInt(top, bottom), minSizeUnit);
    if (!snakeCoords.some(({ x, y }) => randomCoords.x === x && randomCoords.y === y)) break;
  }

  return randomCoords;
}


const TRANSITION_DURATION = 2000;

function fadeIn() {
  element.style.transition = `opacity ${TRANSITION_DURATION / 1000}s linear`;
  element.addEventListener('transitionend', () => element.style.transition = 'none');
  requestAnimationFrame(() => element.style.opacity = 1); 
}

/*
  transitionColors(ms=this.TRANSITION_DURATION) { 
    // Due to performance issues, we transition opacity of the ::before pseudo-element, not the food element itself.
    this.element.style.setProperty("--pseudo-color", this.color); // sync ::before and main element color
    
    const newRandomColor = Color.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] });
    this.element.style.backgroundColor = newRandomColor; // Change the main element color.

    // The change is hidden by the fully opaque pseudo-element.
    this.element.style.setProperty("--pseudo-transition", 'none'); 
    this.element.style.setProperty("--pseudo-opacity", 1); 
    
    this.element.offsetLeft; // force repaint

    // Increasingly transparent pseudo-element gradually reveals the new color of the food element underneath.
    this.element.style.setProperty("--pseudo-transition", `opacity ${this.TRANSITION_DURATION / 1000}s linear`); 
    this.element.style.setProperty("--pseudo-opacity", 0);

    this.color = newRandomColor; 
    setTimeout(() => this.transitionColors(), this.TRANSITION_DURATION); 
  }
}
*/

export { generateRandomCoords }; // used only in tests
