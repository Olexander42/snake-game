import { board } from "../board/board.js";
import { menuButtons, sizeSlider, boxOutline } from "./elements.js";
import { html } from "../../common/elements.js";

 
class Slider {
  constructor() {
    this.range = sizeSlider;
    this.curValue = Number(this.range.value);
  }

  thumbTransition() {
    this.targetValue = Number(this.range.value);
    this.range.value = this.curValue;
    this.range.step = 2;

    const step = () => {
      this.curValue += (this.curValue > this.targetValue) ? -2 : 2;
      this.range.value = this.curValue;

      board.thick = this.curValue; 
      board.init();
  
      this._updateGradient();

      if (this.curValue === this.targetValue) {
        this.range.step = 10;
        //this.prevValue = this.range.value;

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

const slider = new Slider();


function flipButton(event) {
  const side = this;  
  const button = side.parentNode;

  const switchClass = () => { button.classList.contains("clicked") ? button.classList.remove("clicked") : button.classList.add("clicked") }

  if (
    (!(side.classList.contains("rear") && event.target !== this)) 
    || [...document.querySelectorAll('fieldset')].includes(event.target)
  ) switchClass();  // don't react to .rear.side children events, but react to the empty space in <fieldset>
}

function closeButtons(event) {
  if (event.target === this) {
    [...document.querySelectorAll(".clicked")].forEach((clickedButton) => clickedButton.classList.remove("clicked"));
  }
}

function moveBoxOutline(event) {
  const box = this;
  boxOutline.style.left = box.offsetLeft + 'px';
}


export { slider, flipButton, closeButtons, moveBoxOutline }

