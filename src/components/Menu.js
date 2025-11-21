import { setTheme } from "../common/helpers.js";
import { startBtn, settingsBtn } from "../common/elements.js";


class Menu {
  constructor(game) {
    this.game = game;

    this.mainMenuDiv = document.getElementById("main-menu");
    this.settingsDiv = document.getElementById("settings-menu");
    this.sizeInput = document.getElementById("size-slider");

    this.firstStart = true;
    this.settingsVisited = false;

    this._attachStartListener();
    this._attachSettingsListener();
  }

  _attachStartListener() {  
    startBtn.addEventListener('click', () => { 
      if (this.firstStart) {
        this.game.board.normalize(this.sizeInput.value);
        this.game.attachControls();

        startBtn.innerText = "Start Again";
        this.firstStart = false;  
      }
      else {
        this.game.reset();
      }

      // hide menu
      startBtn.style.display = 'none';
      settingsBtn.style.display = 'none';

      this.game.begin();
    })
  }

  _attachSettingsListener() {
    settingsBtn.addEventListener('click', () => {
      // show settings
      this.mainMenuDiv.style.display = 'none';
      this.settingsDiv.style.display = 'flex';

      // do it only on the first visit
      if (!this.settingsVisited) { 
        const buttonsSides = document.querySelectorAll(".side");
        const colorOptions = document.querySelectorAll("input[name='color']");
        const themeOptions = document.querySelectorAll("input[name='theme']");
        const backBtn = document.getElementById("back-btn");

        const buttonFlipper = new ButtonFlipper(buttonsSides); 
        const sizeSlider = new Slider(this.sizeInput, 3, (value) => this.game.board.normalize(value));
        const colorOptionOutline = new Outline("#color-set");
        const themeThumbnailOutline = new Outline("#theme-set", (value) => setTheme(value));

        buttonFlipper.attach();
        sizeSlider.attach();
        colorOptionOutline.attach(colorOptions);
        themeThumbnailOutline.attach(themeOptions);

        backBtn.addEventListener('click', () => { 
          // hide settings   
          this.settingsDiv.style.display = 'none';
          this.mainMenuDiv.style.display = 'flex';
        })

        this.settingsVisited = true;
      } 
    })
  }
}

// helpers
class ButtonFlipper { 
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
    const settingsDiv = document.getElementById("settings-menu");

    if (event.target === event.currentTarget || settingsDiv === event.target) { // if clicked anywhere outside the buttons
      [...document.querySelectorAll(".clicked")].forEach((clickedButton) => clickedButton.classList.remove("clicked"));
    }
  }

  attach() {
    [...this.buttonsSides].forEach((side) => side.addEventListener('click', (event) => this._flipButton(event)));
    document.querySelector('body').addEventListener('click', (event) => this._closeButtons(event));
  }
}


class Slider {
  constructor(input, speed, recipient=undefined) {
    this.input = input;
    this.STEP_DEFAULT = this.input.step;
    this.STEP_TRANSITION = speed;
    this.recipient = recipient;

    this.requiresAdjustment = this.STEP_DEFAULT % this.STEP_TRANSITION === 0 ? false : true;
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


class Outline {
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



export default Menu;
