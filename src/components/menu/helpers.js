export class ButtonFlipper { 
  constructor(buttonsSides) {
    this.buttonsSides = buttonsSides;
  }
  _flipButton(event) {
    const side = event.currentTarget;  
    const button = side.parentElement;
    const fieldsets = [...document.querySelectorAll('fieldset')];
    
    if (
      (!(side.classList.contains("rear") && event.target !== side)) // ignore children on rear side
      || fieldsets.includes(event.target) // but don't ignore <fieldset>
    )  {   
      button.classList.toggle("clicked"); 
    }
  }

  _closeButtons(event) { 
    if (event.target === event.currentTarget || getElement.settingsDiv() === event.target) { // if clicked anywhere outside the buttons
      [...document.querySelectorAll(".clicked")].forEach((clickedButton) => clickedButton.classList.remove("clicked"));
    }
  }

  attach() {
    [...this.buttonsSides].forEach((side) => side.addEventListener('click', (event) => this._flipButton(event)));
    getElement.body().addEventListener('click', (event) => this._closeButtons(event));
  }
}


export class Slider {
  constructor(input, speed, recipient=undefined) {
    this.input = input;
    this.STEP_DEFAULT = this.input.step;
    this.STEP_TRANSITION = speed;
    this.recipient = recipient;

    this.requiresAdjustment = this.STEP_DEFAULT % this.STEP_TRANSITION !== 0;
    this.currentValue = Number(this.input.value);
  }

  moveThumb() {
    this.targetValue = Number(this.input.value);
    this.input.value = this.currentValue;
    this.input.step = this.STEP_TRANSITION; 

    requestAnimationFrame(() => this._step());
  }

  _step() {
      this.currentValue += (this.currentValue > this.targetValue) // increase or decrease value?
        ? -this.STEP_TRANSITION 
        : this.STEP_TRANSITION;
      this.input.value = this.currentValue;

      this._updateGradient();

      if (this.currentValue === this.targetValue) { // finished transitioning
        this.input.step = this.STEP_DEFAULT;

        if (this.recipient) this.recipient(this.input.value);

      } else {
        if (this.requiresAdjustment) {
          const delta = (Math.abs(this.currentValue - this.targetValue));
          if  (delta < this.STEP_TRANSITION) { // time for adjustment
            this.STEP_TRANSITION = delta; // make sure the next currentValue === targetValue
          }
        }

        requestAnimationFrame(() => this._step()); 
      }
    }

  _updateGradient() {
    const gradientCutoffVal = (this.input.value - this.input.min) / (this.input.max - this.input.min) * 100;
    const gradient = `linear-gradient(to right, black, black ${gradientCutoffVal}%, transparent ${gradientCutoffVal}%, transparent)`;

    this.input.style.setProperty("--responsive-gradient", gradient);
  } 

  attach() {
    this.input.addEventListener('input', (event) => this.moveThumb(event));
  }
}


export class Outline {
  constructor(fieldsetId, recipient=undefined) {
    this.fieldset = document.querySelector(fieldsetId);
    this.element = document.querySelector(`${fieldsetId} .outline`);
    this.recipient = recipient;

    this._attachInternalTransitionListeners();
    this._moveToChecked();
  }

  _moveToChecked() {
    requestAnimationFrame(() => { // give time for :checked to update
      const checked = document.querySelector(`#${this.fieldset.id} input:checked + span`);
      const newLeft = checked.offsetLeft;
      this.element.style.left = `${newLeft}px`;
    })
  }

  _attachInternalTransitionListeners() {
    // native CSS outline replaces disappeared outline element and vice versa 
    // because of possible layout shifts 
    this.element.addEventListener('transitionstart', () => {
      this.element.style.opacity = 1;
    })

    this.element.addEventListener('transitionend', () => {
      this.element.style.opacity = 0;
      this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)') 
    })
  }

  attach(elements) {
    [...elements].forEach((element) => element.addEventListener('click', (event) => { 
      this.fieldset.style.setProperty("--checked-outline", 'none'); // hide CSS outline asap to avoid flashes
      this._moveToChecked();

      if (this.recipient) this.recipient(event.currentTarget.value);
    }));
  }
}