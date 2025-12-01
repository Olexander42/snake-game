import { ButtonFlipper, Slider, Outline } from "./helpers.js";
import { handleInput, updateFocusibleElements } from "./keyboardNavigation.js";
import setTheme from "../../common/setTheme.js";
import getElement from "../../common/elements.js";


export default class Menu {
  constructor(game) {
    this.game = game;

    this.mainMenuDiv = document.getElementById("main-menu");
    this.settingsBtn = getElement.settingsBtn();

    this.firstStart = true;
    this.settingsVisited = false;

    this._attachStartListener();
    this._attachSettingsListener();
    getElement.html().addEventListener('keydown', () => handleInput(this.game.isActive));

    updateFocusibleElements("main menu");
  }

  _attachStartListener() {  
    const startBtn = getElement.startBtn();

    startBtn.addEventListener('click', (event) => { 
      if (this.firstStart) {
        this.game.attachControls();

        startBtn.innerText = "Start Again";
        this.firstStart = false;  
      }
      else {
        this.game.reset();
      }

      this.game.isActive = true;
      this.game.begin();

     getElement.menu().style.display = 'none';
    })
  }

  _attachSettingsListener() {
    const sizeInput = getElement.sizeInput();

    this.settingsBtn.addEventListener('click', () => {
      // show settings
      this.mainMenuDiv.style.display = 'none';
      getElement.settingsDiv().style.display = 'flex';

      this._updateFocusibleElements("settings menu");

      // do it only on the first visit
      if (!this.settingsVisited) { 
        const buttonsSides = document.querySelectorAll(".side");
        const colorOptions = document.querySelectorAll("input[name='color']");
        const themeOptions = document.querySelectorAll("input[name='theme']");
        const backBtn = document.getElementById("back-btn");

        const buttonFlipper = new ButtonFlipper(buttonsSides); 
        const sizeSlider = new Slider(sizeInput, 3, (value) => this.game.board.normalize(value));
        const colorOptionOutline = new Outline("#color-set");
        const themeThumbnailOutline = new Outline("#theme-set", (value) => setTheme(value));

        buttonFlipper.attach();
        sizeSlider.attach();
        colorOptionOutline.attach(colorOptions);
        themeThumbnailOutline.attach(themeOptions);

        backBtn.addEventListener('click', () => { 
          // hide settings   
          getElement.settingsDiv().style.display = 'none';
          this.mainMenuDiv.style.display = 'flex';

          this._updateFocusibleElements("main menu");
        })

        this.settingsVisited = true;
      } 
    })
  }
}




