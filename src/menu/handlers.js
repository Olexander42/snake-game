import { menu, settingsMenu } from "../common/elements.js";
import setTheme from "../common/theme.js";

import { updateFocusibleElements } from "./keyboardNavigation.js";
import { buttonFlipper, sliderMover as sizeSliderMover, Outline } from "./components.js";


export let startBtn, settingsBtn;

let firstStart = true;
let settingsVisited = false;
let mainMenu;

export function handleStartBtn(game) {  
  if (game.isFirstStart) {
    startBtn.innerText = "Start Again";

    game.attachControls();
  } else game.reset();

  menu.style.display = 'none';
  game.begin();
}

export function handleSettingsBtn() {
  mainMenu.style.display = 'none';
  settingsMenu.style.display = 'flex';

  updateFocusibleElements("settings menu");

  if (!settingsVisited) { 
    attachSettingsListeners();
    settingsVisited = true;
  }
}

export function initMenuElements() {
  mainMenu = document.getElementById("main-menu");
  startBtn = document.getElementById("start-btn");
  settingsBtn = document.getElementById("settings-btn");
}

function attachSettingsListeners() {
  buttonFlipper.attach();
  sizeSliderMover.attach();
  attachOutlines();
  attachBackBtnListener();
}

function attachOutlines() {
  const colorOptionOutline = new Outline("#color-set");
  const themeThumbnailOutline = new Outline("#theme-set", setTheme);

  const colorOptions = [...document.querySelectorAll("input[name='snake-color']")]; 
  const themeOptions = [...document.querySelectorAll("input[name='theme']")];

  colorOptionOutline.attachTo(colorOptions);
  themeThumbnailOutline.attachTo(themeOptions);
}

function attachBackBtnListener() {
  document.getElementById("back-btn")
    .addEventListener('click', () => {
      mainMenu.style.display = 'flex';
      settingsMenu.style.display = 'none';

      updateFocusibleElements("main menu");
    })
}
















