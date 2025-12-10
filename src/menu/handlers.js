import { settingsMenu } from "../common/elements.js";
import setTheme from "../common/theme.js";
import { updateFocusibleElements } from "./keyboardNavigation.js";
import { buttonFlipper, sliderMover as sizeSliderMover, Outline } from "./components.js";
//import * as Game from "../game/game.js";
const Game = null;


let firstStart = true;
let settingsVisited = false;
let startBtn, settingsBtn, mainMenu;

function handleStartBtn() {  
  if (firstStart) {
    firstStart = false;
    startBtn.innerText = "Start Again";

    Game.attachControls();
  } else Game.reset();

  mainMenu.style.display = 'none';
  Game.begin();
}

function handleSettingsBtn() {
  mainMenu.style.display = 'none';
  settingsMenu.style.display = 'flex';

  updateFocusibleElements("settings menu");

  if (!settingsVisited) { 
    attachSettingsListeners();
    settingsVisited = true;
  }
}

const attachSettingsListeners = () => {
  buttonFlipper.attach();
  sizeSliderMover.attach();
  attachOutlines();
  attachBackBtnListener();
}

const attachOutlines = () => {
  const colorOptionOutline = new Outline("#color-set");
  const themeThumbnailOutline = new Outline("#theme-set", setTheme);

  const colorOptions = [...document.querySelectorAll("input[name='snake-color']")]; 
  const themeOptions = [...document.querySelectorAll("input[name='theme']")];

  colorOptionOutline.attachTo(colorOptions);
  themeThumbnailOutline.attachTo(themeOptions);
}

const attachBackBtnListener = () => {
  const backBtn = document.getElementById("back-btn");

  backBtn.addEventListener('click', () => {
    mainMenu.style.display = 'flex';
    settingsMenu.style.display = 'none';

    updateFocusibleElements("main menu");
  })
}


export default function attachMainMenuListeners() {
  initElements();

  startBtn.addEventListener('click', handleStartBtn);
  settingsBtn.addEventListener('click', handleSettingsBtn);
}

const initElements = () => {
  startBtn = document.getElementById("start-btn");
  settingsBtn = document.getElementById("settings-btn");
  mainMenu = document.getElementById("main-menu");
}














