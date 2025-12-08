import { settings, sizeSlider, body } from "../common/elements.js";
import { normalize as normalizeBoard }  from "../components/board.js";


export const buttonFlipper = (() => {
  function flipButton(event) { // <--- maybe don't pass an entire event?
    const side = event.currentTarget; 
    const isClickedOnOption = side.classList.contains("rear") && event.target !== side;
    const isClickedOnFieldset = [...document.querySelectorAll('fieldset')].includes(event.target); 
    
    if (!isClickedOnOption || isClickedOnFieldset) side.parentElement.classList.toggle("clicked"); 
  }

  function closeAllButtons(event) {
    const isClickedBetweenButtons = event.target === settings;
    const isClickedOnBoard = event.target === border;
    const isClickedOnBody = event.target === body;
    const isClickedOutsideButtons = isClickedBetweenButtons || isClickedOnBoard || isClickedOnBody;

    if (isClickedOutsideButtons) { 
      const clickedButtons = [...document.querySelectorAll(".clicked")];
      clickedButtons.forEach((clickedButton) => clickedButton.classList.remove("clicked"));
    }
  }
 
  return {
    attach: () => {
      const buttonsSides = [...document.querySelectorAll(".side")];
      buttonsSides.forEach((buttonSide) => buttonSide.addEventListener('click', flipButton)); 

      body.addEventListener('click', closeAllButtons);
    }
  }
})();


export const sliderMover = ((slider, recipient) => {
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
    updateGradient();

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

  const min = slider.min;
  const max = slider.max;
  const PERCENT_100 = 100;

  function updateGradient() {
    const gradientCutoffValue = (currentValue - min) / (max - min) * PERCENT_100;
    const gradient = `linear-gradient(to right, black, black ${gradientCutoffValue}%, transparent ${gradientCutoffValue}%, transparent)`;
    slider.style.setProperty("--responsive-gradient", gradient);
  } 

  return { attach: () => slider.addEventListener('input', moveThumb)}
})(sizeSlider, normalizeBoard());


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
      // Native CSS outline replaces disappeared outline element.
      this.element.style.opacity = 0;
      this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)'); 
    })
  }

  attachTo(elements) {
    [...elements].forEach((element) => element.addEventListener('click', (event) => { 
      this.fieldset.style.setProperty("--checked-outline", 'none'); // Hide CSS outline asap to avoid flashes.
      this._moveToChecked();

      if (this.recipient) this.recipient(event.currentTarget.value);
    }));
  }
}

