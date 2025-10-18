import { board } from "../board/board.js";
import { menuButtons, sizeSlider } from "./elements.js";
import { html } from "../../common/elements.js";

 
class Slider {
  constructor() {
    this.range = sizeSlider;
    this.curValue = Number(this.range.value);
  }

  moveThumb() {
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
    this.gradient = `linear-gradient(to right, black, black ${this.gradientCutoffVal}%, transfieldsetId ${this.gradientCutoffVal}%, transfieldsetId)`;
    this.range.style.setProperty("--responsive-gradient", this.gradient);
  }
}

class Outline {
  constructor(fieldsetId) {
    this.fieldset = document.querySelector(fieldsetId);
    this.element = document.querySelector(`${fieldsetId} .outline`);

    this._addListenerSwapOutline();
  }

  move(target) {
    this.element.style.left = `${target.offsetLeft}px`;
  }

  disableCssOutline() {
    this.fieldset.style.setProperty("--checked-outline", 'none'); 
  }

  goToChecked() {
    const checked = document.querySelector(`#${this.fieldset.id} input:checked + span`);
    this.move(checked);
  } 

  _addListenerSwapOutline() {
    // the native CSS outline replaces the disappeared outline element and vice versa
    ['transitionstart', 'transitionend'].forEach((eventName) => {
      this.element.addEventListener(eventName, () => {
        const opacity = eventName === 'transitionstart' ? 1 : 0;
        this.element.style.opacity = opacity;

        if (eventName === 'transitionend') {
          this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)');
        }
      })
    })
  }
}

function flipButton(event) {
  const side = this;  
  const button = side.parentElement;

  const switchClass = () => { button.classList.contains("clicked") ? button.classList.remove("clicked") : button.classList.add("clicked") }
  
  if (
    (!(side.classList.contains("rear") && event.target !== this)) 
    || [...document.querySelectorAll('fieldset')].includes(event.target)
  ) switchClass();  // don't react to .rear.side children events, but react to the empty space in <fieldset>
}

function closeButtons(event) {
  // close buttons if clicked anywhere outside the buttons
  if (event.target === this || document.getElementById("settings-menu") === event.target ) { 
    [...document.querySelectorAll(".clicked")].forEach((clickedButton) => clickedButton.classList.remove("clicked"));
  }
}

const slider = new Slider();

const outlines = {
  colorBox: new Outline("#color-set"),
  themeThumbnail: new Outline("#theme-set"),
}


export { slider, outlines, flipButton, closeButtons }

