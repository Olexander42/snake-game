import { board } from "../board/Board.js";
import { menuButtons, sizeSlider } from "./elements.js";
import { html } from "../../common/elements.js";



 


const slider = new Slider();

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

const outlines = {
  colorBox: new Outline("#color-set"),
  themeThumbnail: new Outline("#theme-set"),
}




export { slider, outlines, flipButton, closeButtons }

