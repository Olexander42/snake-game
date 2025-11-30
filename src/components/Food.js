import Color from "../common/Color.js";
import getElement from "../common/getElement.js";
import { normalize, getRandomInt } from "../common/utils.js";
import { TIME_UNIT } from "../common/constants.js";

export default class Food {
  static generateRandomCoords(boardData, snakeData) {
    const bounds = boardData.bounds;
    const step = boardData.step;
    const snakeCoords = snakeData.map(({ x, y }) => ({ x, y }));
    const coords = {}

    while (true) {
      coords.x = normalize(getRandomInt(bounds.left, bounds.right), step);
      coords.y = normalize(getRandomInt(bounds.top, bounds.bottom), step);

      if (!snakeCoords.some(({ x, y }) => coords.x === x && coords.y === y)) break;
    }

    return coords;
  }

  constructor() { 
    // invisible food element is created off board 
    this.element = document.createElement('span');
    this.element.id = "food";
    this.element.style.opacity = 0;
    getElement.container().append(this.element);

    this.color = Color.getRandomColor({ rangeS: [50, 100], rangeL: [25, 75] });
    this.element.style.backgroundColor = this.color; 

    this.TRANSITION_DURATION = 2000;
  }

  teleport(boardData, snakeData) {
    this.coords = Food.generateRandomCoords(boardData, snakeData);

    this.element.style.left = `${this.coords.x}px`;
    this.element.style.top = `${this.coords.y}px`;
  }

  fadeIn() {
    this.element.style.transition = `opacity ${this.TRANSITION_DURATION / 1000}s linear`;
    this.element.addEventListener('transitionend', () => this.element.style.transition = 'none');
    requestAnimationFrame(() => this.element.style.opacity = 1); 
  }

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
