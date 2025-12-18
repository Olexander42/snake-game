import { settingsMenu, bodyEl, borderEl } from "../common/elements.js";
import { updateFocusibleElements, setFocus } from "./keyboardNavigation.js";


export const buttonFlipper = (function() {
  function flipButton(currentTarget, target) { 
    const side = event.currentTarget; 

    const isClickedOnOption = side.classList.contains("rear") && event.target !== side;
    const isClickedOnFieldset = [...document.querySelectorAll('fieldset')].includes(event.target); 
    
    if (!isClickedOnOption || isClickedOnFieldset) side.parentElement.classList.toggle("clicked"); 
  }

  function closeAllButtons(target) {
    const isClickedBetweenButtons = target === settingsMenu;
    const isClickedOnBoard = target === borderEl;
    const isClickedOnBody = target === bodyEl;

    const isClickedOutsideButtons = isClickedBetweenButtons || isClickedOnBoard || isClickedOnBody;

    if (isClickedOutsideButtons) { 
      const openButtons = [...document.querySelectorAll(".clicked")];
      openButtons.forEach((openButton) => openButton.classList.remove("clicked"));
      updateFocusibleElements("settings menu");
    }
  }
 
  return {
    attach: () => {
      [...document.querySelectorAll(".side")]
        .forEach((buttonSide) => buttonSide.addEventListener('click', ({ currentTarget, target }) => {
          flipButton(currentTarget, target);

          if (currentTarget.classList.contains("front")) {
            setFocus(currentTarget.parentNode);
            updateFocusibleElements("settings button");
          }
        }));

      bodyEl.addEventListener('click', ({ target }) => closeAllButtons(target));
    }
  }
})();


export class Slider {
  static SPEED = 0.2;

  constructor(slider, recipient) {
    this.slider = slider;
    this.recipient = recipient;

    this.STEP_DEFAULT = parseInt(this.slider.step);
    this.currentValue = parseInt(this.slider.value);

    this.options = [...document.querySelectorAll(`#${this.slider.id} + datalist option`)];
  }

  _moveThumb(value = this.slider.value) {
    // Intercept input before the slider reacts to it.
    this.targetValue = parseInt(value); 
    this.slider.value = this.currentValue; 

    const totalDistance = this.targetValue - this.currentValue;
    const ONE_PERCENT = 0.01;
    this.minStep = Math.abs(totalDistance * ONE_PERCENT);
    this.direction = 1 * Math.sign(totalDistance);

    this.slider.step = this.minStep;
    
    this._updateGradient();
    this._makeStep();
  }

  _makeStep() {
    const step = this._calcStep();
    this.currentValue += step * this.direction;
    this.slider.value = this.currentValue;

    this._updateGradient();

    if (this.currentValue === this.targetValue) { 
      this.recipient();
      this.slider.step = this.STEP_DEFAULT;
    } else {
      requestAnimationFrame(() => this._makeStep());
    }
  }

  _calcStep() {
    const distLeft = Math.abs(this.targetValue - this.currentValue);
    this.minStep = distLeft < this.minStep ? distLeft : this.minStep; // don't overshoot the target value

    return Math.max(distLeft * Slider.SPEED, this.minStep); // don't slow down in the last 1% of the transition
  }

  _updateGradient() {
    const HUNDRED_PERCENT = 100;

    const cutoffVal = (this.currentValue - this.slider.min) / (this.slider.max - this.slider.min) * HUNDRED_PERCENT;
    const grad = `linear-gradient(to right, black, black ${cutoffVal}%, transparent ${cutoffVal}%, transparent)`;
    this.slider.style.setProperty("--responsive-gradient", grad);
  }

  attach() {
    this.slider.addEventListener('input', () => this._moveThumb()); 
    this.options.forEach((option) => {
      option.addEventListener('click', ({ currentTarget: { value } }) => this._moveThumb(value));
    });
  }
}


export class Outline {
  constructor(fieldsetId, recipient=undefined) {
    this.fieldset = document.querySelector(fieldsetId);
    this.element = document.querySelector(`${fieldsetId} .outline`);
    this.recipient = recipient;
    this.checked = null;
    
    this._attachInternalTransitionListeners(); // prevent shifts during theme changes.
    this._moveToChecked();
  }

  async _moveToChecked() {
    const oldChecked = this.checked;
    await this._updateChecked();
  
    if (oldChecked !== this.checked) {
      this.fieldset.style.setProperty("--checked-outline", 'none'); // hide CSS outline asap to avoid flashes
      this.element.style.left = `${this.checked.offsetLeft}px`; 
    }
  }

  _attachInternalTransitionListeners() { 
    this.element.style.left = 0; // enable the first transition

    this.element.addEventListener('transitionstart', () => {
      this.element.style.opacity = 1;
    })

    this.element.addEventListener('transitionend', () => {
      // Native CSS outline replaces disappeared outline element.
      this.element.style.opacity = 0;
      this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)');
    })
  }

  _updateChecked() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        // Give time for :checked to update. 
        this.checked = document.querySelector(`#${this.fieldset.id} input:checked + span`);
        resolve(true);
      })
    })
  }

  attachTo(elements) {
    [...elements].forEach((element) => element.addEventListener('click', (event) => { 
      this._moveToChecked();

      if (this.recipient) this.recipient(event.currentTarget.value);
    }));
  }
}

