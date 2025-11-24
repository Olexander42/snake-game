import Color from "../common/Color.js";
import getElement from "../common/elements.js";
import { normalize, getRandomInt, sleep } from "../common/utils.js";
import { TIME_UNIT, MS_PER_SECOND } from "../common/constants.js";

class Food {
  constructor() { // invisible food element is created off board 
    this.element = document.createElement('span');
    this.element.id = "food";
    this.element.style.opacity = 0;
    getElement.container().append(this.element);

    this.color = new Color();
    this.color.string = this.color.getRandomColor({ changeS: [50, 100], changeL: [25, 75] })
    this.element.style.backgroundCcolor = this.color.string; 

    this.colorTransitionDuration = MS_PER_SECOND * 2;
  }

  teleport(boardData, snakeData) {
    // generate random coords
    const bounds = boardData.bounds;
    const step = boardData.step;
    this.coords = {}

    while (true) {
      this.coords.x = normalize(getRandomInt(bounds.left, bounds.right), step);
      this.coords.y = normalize(getRandomInt(bounds.top, bounds.bottom), step);

      if (!snakeData.includes(this.coords)) break;
    }

    // apply
    this.element.style.left = `${this.coords.x}px`;
    this.element.style.top = `${this.coords.y}px`;
  }

  fadeIn() {
    this.element.style.transition = `opacity ${TIME_UNIT / MS_PER_SECOND }s linear`;
    this.element.addEventListener('transitionend', () => this.element.style.transition = 'none');
    requestAnimationFrame(() => this.element.style.opacity = 1); 
  }

  async transitionColors() { 
    await sleep(this.colorTransitionDuration);
    // Due to performance issues, we transition opacity of the ::before pseudo-element, not the food element itself.
    this.element.style.setProperty("--pseudo-color", this.color.string); // sync ::before and main element color
    
    const newRandomColor = this.color.getRandomColor();
    this.element.style.backgroundColor = newRandomColor; // Change the main element color.
    // The change is hidden by the fully opaque pseudo-element.
    this.element.style.setProperty("--pseudo-transition", 'none'); 
    this.element.style.setProperty("--pseudo-opacity", 1); 
    
    // Apply changes on the next repaint.
    requestAnimationFrame(() => {
      // Increasingly transparent pseudo-element gradually reveals the new color of the food element underneath.
      this.element.style.setProperty("--pseudo-transition", `opacity ${this.colorTransitionDuration / MS_PER_SECOND}s linear`); 
      this.element.style.setProperty("--pseudo-opacity", 0); 
    })  

    this.color.string = newRandomColor; 
    this.transitionColors();
  }
}


export default Food;