import { menu, settings } from "../common/elements.js";
import setTheme from "../common/theme.js";
import { updateContext as updateFocusibleElements } from "./keyboardNavigation.js";
import { buttonFlipper, sliderMover as sizeSliderMover, Outline } from "./components.js";


let firstStart = true;
let startBtn;

function handleStartBtn(game) {  
  if (firstStart) {
    firstStart = false;
    startBtn.innerText = "Start Again";

    game.attachControls();
  } else game.reset();

  menu.style.display = 'none';
  game.begin();
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
  }
}


export default function attachMainMenuListeners(game) {
  startBtn = document.getElementById("start-btn");
  startBtn.addEventListener('click', () => handleStartBtn(game));

  document.getElementById("settings-btn").addEventListener('click', handleSettingsBtn);
}














