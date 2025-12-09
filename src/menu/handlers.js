import { menu, settings } from "../common/elements.js";
import setTheme from "../common/theme.js";
import { updateContext as updateFocusibleElements } from "./keyboardNavigation.js";
import { buttonFlipper, sliderMover as sizeSliderMover, Outline } from "./components.js";
//import * as Game from "../game/game.js";
const Game = null;


let firstStart = true;
let startBtn;

function handleStartBtn() {  
  if (firstStart) {
    firstStart = false;
    startBtn.innerText = "Start Again";

    Game.attachControls();
  } else Game.reset();

  menu.style.display = 'none';
  Game.begin();
}


let settingsVisited = false;
let mainMenu;

function handleSettingsBtn() {
  mainMenu ??= document.getElementById("main-menu");

  mainMenu.style.display = 'none';
  settings.style.display = 'flex';

  updateFocusibleElements("settings menu");

  if (!settingsVisited) { 
    attachSettingsListeners();
    settingsVisited = true;
  }
} 

function attachSettingsListeners() {
  buttonFlipper.attach();
  sizeSliderMover.attach();

  const colorOptionOutline = new Outline("#color-set");
  const themeThumbnailOutline = new Outline("#theme-set", setTheme);

  const colorOptions = [...document.querySelectorAll("input[name='color']")]; 
  const themeOptions = [...document.querySelectorAll("input[name='theme']")];

  colorOptionOutline.attachTo(colorOptions);
  themeThumbnailOutline.attachTo(themeOptions);

  attachBackBtnListener();
}

function attachBackBtnListener() {
  document.getElementById("back-btn").addEventListener('click', () => {
    settings.style.display = 'none';
    mainMenu.style.display = 'flex';

    updateFocusibleElements("main menu");
  })
}


export default function attachMainMenuListeners(game) {
  startBtn = document.getElementById("start-btn");
  startBtn.addEventListener('click', () => handleStartBtn(game));

  document.getElementById("settings-btn").addEventListener('click', handleSettingsBtn);
}














