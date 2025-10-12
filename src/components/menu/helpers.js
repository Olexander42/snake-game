import { board } from "../board/board.js";
import { menuButtons, sizeSlider } from "./elements.js";


class Slider {
  constructor() {
    this.range = sizeSlider;
    this.oldValue = this.range.value;
  }

  thumbTransition() {
    this.targetValue = this.range.value;
    this.range.value = this.oldValue;
    this.range.step = 1;

    const step = (timestamp) => {
      this.range.value += this.range.value > this.targetValue ? -1 : +1;
      board.thick = parseInt(this.range.value); 
      board.init();

      this._updateGradient();

      if (this.range.value === this.targetValue) {
        this.range.step = 10;
        this.oldValue = this.range.value;

        board.normalize();       
      } else {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  _updateGradient() {
    this.gradientCutoffVal = (this.range.value - this.range.min) / (this.range.max - this.range.min) * 100;
    this.gradient = `linear-gradient(to right, black, black ${this.gradientCutoffVal}%, transparent ${this.gradientCutoffVal}%, transparent)`;
    this.range.style.setProperty("--responsive-gradient", this.gradient);
  }
}

function flipButton(e) {
  const side = this;  
  const button = side.parentNode;

  const flipButton = () => { button.classList.contains("clicked") ? button.classList.remove("clicked") : button.classList.add("clicked") }

  if (!(side.classList.contains("rear") && e.target !== this)) flipButton();  // don't react to .rear.side children events 
}

const slider = new Slider();


export { slider, flipButton };

