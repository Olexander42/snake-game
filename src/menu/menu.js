import { html, menu, settingsDiv, sizeInput, startBtn } from "../common/elements.js";
import setTheme from "../common/theme.js";

import { normalize as normalizeBoard } from "../components/board.js";
//import * as Game from "../game.js";
const Game = null; // mock
import attachButtonFlipperTo from "./helpers/buttonFlipper.js";
import Slider from "./helpers/Slider.js";
import Outline from "./helpers/Outline.js";
import { updateFocusibleElements } from "./keyboardNavigation.js";


let firstStart = true;

export function handleStartBtn() {  
  if (firstStart) {
    firstStart = false;
    startBtn.innerText = "Start Again"; 

    Game.attachControls();
  } else {
    Game.reset();
  }

  menu.style.display = 'none';
  Game.begin();
}

const mainMenuDiv = document.getElementById("main-menu");
let settingsVisited = false;

export function handleSettingsBtn() {
  mainMenuDiv.style.display = 'none';
  settingsDiv.style.display = 'flex';

  updateFocusibleElements("settings menu");

  if (!this.settingsVisited) { 
    this.settingsVisited = true;

    const buttonsSides = [...document.querySelectorAll(".side")];
    const colorOptions = [...document.querySelectorAll("input[name='color']")];
    const themeOptions = [...document.querySelectorAll("input[name='theme']")];
    const backBtn = document.getElementById("back-btn");

    const sizeSlider = new Slider(sizeInput, 3, (value) => normalizeBoard(value));
    const colorOptionOutline = new Outline("#color-set");
    const themeThumbnailOutline = new Outline("#theme-set", (value) => setTheme(value));

    attachButtonFlipperTo(buttonsSides);
    colorOptionOutline.attachTo(colorOptions);
    themeThumbnailOutline.attachTo(themeOptions);

    backBtn.addEventListener('click', handleBackBtn);
  }
} 

export function handleBackBtn() {
  settingsDiv.style.display = 'none';
  mainMenuDiv.style.display = 'flex';

  updateFocusibleElements("main menu");
}







