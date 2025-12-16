import { settingsMenu, sizeSlider, bodyEl, borderEl } from "../common/elements.js";
import { normalize as normalizeBoard }  from "../components/board.js";


export const buttonFlipper = (function() {
  function flipButton(event) { // <--- maybe don't pass an entire event?
    const side = event.currentTarget; 

    const isClickedOnOption = side.classList.contains("rear") && event.target !== side;
    const isClickedOnFieldset = [...document.querySelectorAll('fieldset')].includes(event.target); 
    
    if (!isClickedOnOption || isClickedOnFieldset) side.parentElement.classList.toggle("clicked"); 
  }

  function closeAllButtons(event) {
    const isClickedBetweenButtons = event.target === settingsMenu;
    const isClickedOnBoard = event.target === borderEl;
    const isClickedOnBody = event.target === bodyEl;

    const isClickedOutsideButtons = isClickedBetweenButtons || isClickedOnBoard || isClickedOnBody;

    if (isClickedOutsideButtons) { 
      [...document.querySelectorAll(".clicked")]
        .forEach((clickedButton) => clickedButton.classList.remove("clicked"));
    }
  }
 
  return {
    attach: () => {
      [...document.querySelectorAll(".side")]
        .forEach((buttonSide) => buttonSide.addEventListener('click', flipButton));
      bodyEl.addEventListener('click', closeAllButtons);
    }
  }
})();


export const sizeSliderMover = (function(slider, recipient) { 
  const STEP_DEFAULT = parseInt(slider.step);
  const STEP_TRANSITION = 3;

  const isRequiresAdjustment = STEP_DEFAULT % STEP_TRANSITION !== 0;

  let currentValue = parseInt(slider.value);
  let targetValue;

  function moveThumb() {
    targetValue = parseInt(slider.value);

    slider.value = currentValue;
    slider.step = STEP_TRANSITION; 

    requestAnimationFrame(() => makeStep(STEP_TRANSITION));
  }

  function makeStep(step) {
    currentValue += (currentValue > targetValue) ? -step : step;
    slider.value = currentValue;
    updateGradient(currentValue);

    if (currentValue === targetValue) { 
      recipient();
      slider.step = STEP_DEFAULT;
    } else {
      if (isRequiresAdjustment) {
        const delta = (Math.abs(currentValue - targetValue));
        if (delta < STEP_TRANSITION) {
          requestAnimationFrame(() => makeStep(delta));
          return;
        }
      }
      requestAnimationFrame(() => makeStep(step));
    }
  }

  function updateGradient(val) {
    const min = slider.min;
    const max = slider.max;
    const PERCENT_100 = 100;

    const cutOffVal = (val - min) / (max - min) * PERCENT_100;
    const grad = `linear-gradient(to right, black, black ${cutOffVal}%, transparent ${cutOffVal}%, transparent)`;
    slider.style.setProperty("--responsive-gradient", grad);
  }
  updateGradient(currentValue); // apply default gradient

  return { attach: () => slider.addEventListener('input', moveThumb) }
})(sizeSlider, normalizeBoard);


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

