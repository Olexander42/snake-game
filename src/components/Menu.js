class Menu {
  constructor() {
    // main menu 
    this.mainMenuDiv = document.getElementById("main-menu");
    this.settingsDiv = document.getElementById("settings-menu");
    this.startBtn = document.getElementById("start-btn");
    this.settingsBtn = document.getElementById("settings-btn");

    // settings
    this.buttonsSides = document.querySelectorAll(".side");
    this.sizeInput = document.getElementById("size-slider");
    this.colorOptions = document.querySelectorAll(".color-box");
    this.themeThumbnails = document.querySelectorAll(".thumbnail");
    this.back = document.getElementById("back-btn");

    this.firstStart = true;
    this.settingsVisited = false;
  }

  attachListeners(game) {
    this.startBtn.addEventListener('click', () => { 
      if (this.firstStart) {
        game.board.normalize(this.sizeInput.value);

        this.startBtn.innerText = "Start Again";
        this.firstStart = false;  
      }

      else {
        game.reset();
      }

      // hide menu
      this.startBtn.style.display = 'none';
      this.settingsBtn.style.display = 'none';

      game.begin();
    })

    this.settingsBtn.addEventListener('click', () => {
      if (!this.settingsVisited) {
        this.buttonFlipper = new ButtonFlipper(); 
        this.buttonFlipper.attach(this.buttonsSides);

        this.sizeSlider = new Slider(this.sizeInput, 2, (value) => game.board.normalize(value));
        this.sizeSlider.attach();

        this.colorOptionOutline = new Outline("#color-set");
        this.colorOptionOutline.attach(this.colorOptions);

        this.themeThumbnailOutline = new Outline("#theme-set");
        this.themeThumbnailOutline.attach(this.themeThumbnails);
      }

      // show settings
      this.mainMenuDiv.style.display = 'none';
      this.settingsDiv.style.display = 'flex';
    })
  }
}

class ButtonFlipper {
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

  attach(elements) {
    [...elements].forEach((element) => element.addEventListener('click', (event) => this._flipButton(event)));
    document.querySelector('body').addEventListener('click', (event) => this._closeButtons(event));
  }
}


class Slider {
  constructor(input, speed, recipient=undefined) {
    this.input = input;
    this.STEP_DEFAULT = this.input.step;
    this.STEP_TRANSITION = speed;
    this.recipient = recipient;

    this.currentValue = parseInt(this.input.value);
    this._step = this._step.bind(this);
  }

  moveThumb() {
    this.targetValue = parseInt(this.input.value);
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
  constructor(fieldsetId) {
    this.fieldset = document.querySelector(fieldsetId);
    this.element = document.querySelector(`${fieldsetId} .outline`);

    this._attachInternalTransitionListener();
    this._moveToChecked();
  }

  _moveToChecked() {
    requestAnimationFrame(() => { // give time for :checked to update
      const checked = document.querySelector(`#${this.fieldset.id} input:checked + span`);
      const newLeft = checked.offsetLeft;
      this.element.style.left = `${newLeft}px`;
    })
  }

  _attachInternalTransitionListener() {
    // native CSS outline replaces disappeared outline element and vice versa 
    // because of possible layout shifts
    this.element.addEventListener('transitionstart', () => {
      this.element.style.opacity = 1;
    })

    this.element.addEventListener('transitionsend', () => {
      this.element.style.opacity = 0;
      this.fieldset.style.setProperty("--checked-outline", '4px solid var(--white)') 
    })
  }

  attach(elements) {
    [...elements].forEach((element) => element.addEventListener('click', () => { 
      this.fieldset.style.setProperty("--checked-outline", 'none'); // hide CSS outline asap to avoid flashes
      this._moveToChecked();
    }));
  }
}

/*     

      


      
      [...thumbnails].forEach((thumbnail) => thumbnail.addEventListener('click', (e) => {
        outlines.themeThumbnail.disableCssOutline();
        outlines.themeThumbnail.move(e.currentTarget)
        outlines.themeThumbnail.element.addEventListener('transitionend', () => setTheme());
      }))

      menuButtons.back.addEventListener('click', menuHandlers.backHandler);
    }

    states.settingsVisited = true;
  },

  backHandler() {
    settingsMenuDiv.style.display = 'none';
    gameMenuDiv.style.display = 'flex';
  }
}
*/

export default Menu;
