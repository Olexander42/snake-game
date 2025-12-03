import { settingsDiv, sizeInput } from "../common/elements.js";
import { normalize as normalizeBoard }  from "../components/board.js";

export const buttonFlipper = (() => {
  const fieldsets = [...document.querySelectorAll('fieldset')];
  const body = document.querySelector('body');
  const buttonsSides = [...document.querySelectorAll(".side")];

  const flipButton = (event) => {
    const side = event.currentTarget; 

    const isClickedOnOption = side.classList.contains("rear") && event.target !== side;
    const isClickedOnFieldset = fieldsets.includes(event.target); 

    if (!isClickedOnOption || isClickedOnFieldset) side.parentElement.classList.toggle("clicked"); 
  }

  const closeAllButtons = (event) => {
    const isClickedBetweenButtons = event.target === settingsDiv;
    const isClickedOnBoard = event.target === border;
    const isClickedOnBody = event.target === body;

    const clickedButtons = [...document.querySelectorAll(".clicked")];

    if (isClickedBetweenButtons || isClickedOnBoard || isClickedOnBody ) { 
      // clicked anywhere outside the buttons
      clickedButtons.forEach((clickedButton) => clickedButton.classList.remove("clicked"));
    }
  }
 
  return {
    attach: () => {
      buttonsSides.forEach((buttonSide) => buttonSide.addEventListener('click', flipButton));      
      body.addEventListener('click', closeAllButtons);
    }
  }
})()

export const sizeSlider = (() => {
  const STEP_DEFAULT = sizeInput.step;
  const STEP_TRANSITION = 3;
  const isRequiresAdjustment = STEP_DEFAULT % STEP_TRANSITION !== 0;

  let currentValue = parseInt(sizeInput.value);
  let targetValue = null;

  const moveThumb = () => {
    targetValue = parseInt(sizeInput.value);
    sizeInput.value = currentValue;
    sizeInput.step = STEP_TRANSITION; 

    requestAnimationFrame(() => makeStep(STEP_TRANSITION));
  }

  function makeStep(step) {
    currentValue += (currentValue > targetValue) ? -step : step;
    sizeInput.value = currentValue;
    updateGradient();

    if (currentValue === targetValue) { 
      // finished transitioning
      sizeInput.step = STEP_DEFAULT;

      normalizeBoard(targetValue);
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

  function updateGradient() {
    const gradientCutoffValue = (sizeInput.value - sizeInput.min) / (sizeInput.max - sizeInput.min) * 100;
    const gradient = `linear-gradient(to right, black, black ${gradientCutoffValue}%, transparent ${gradientCutoffValue}%, transparent)`;

    sizeInput.style.setProperty("--responsive-gradient", gradient);
  } 

  return { attach: () => sizeInput.addEventListener('input', moveThumb) }
})()


export class Outline {
  constructor(fieldsetId, recipient=undefined) {
    this.fieldset = document.querySelector(fieldsetId);
    this.element = document.querySelector(`${fieldsetId} .outline`);
    this.recipient = recipient;

    this._attachInternalTransitionListeners(); // Prevent shifts during theme changes.
    this._moveToChecked();
  }

  _moveToChecked() {
    // give time for :checked to update
    requestAnimationFrame(() => { 
      const checked = document.querySelector(`#${this.fieldset.id} input:checked + span`);
      this.element.style.left = `${checked.offsetLeft}px`;
    })
  }

  _attachInternalTransitionListeners() {
    this.element.addEventListener('transitionstart', () => {
      this.element.style.opacity = 1;
    })

    this.element.addEventListener('transitionend', () => {
      // native CSS outline replaces disappeared outline element
      this.element.style.opacity = 0;
      this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)'); 
    })
  }

  attachTo(elements) {
    [...elements].forEach((element) => element.addEventListener('click', (event) => { 
      this.fieldset.style.setProperty("--checked-outline", 'none'); // hide CSS outline asap to avoid flashes
      this._moveToChecked();

      if (this.recipient) this.recipient(event.currentTarget.value);
    }));
  }
}

