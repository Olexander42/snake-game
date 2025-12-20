import { menu, settingsMenu, settingsMenuBtn, sizeSlider } from "../common/elements.js";
import setTheme from "../common/theme.js";

import { normalize as normalizeBoard }  from "../components/board.js";

import { addContext, Context, setContext } from "./context.js";
import { buttonFlipper, Slider, Outline } from "./components.js";


export let startBtn;

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

export function handleSettingsMenuBtn() {
  mainMenu.style.display = 'none';
  settingsMenu.style.display = 'flex';

  if (!settingsVisited) { 
    addContext(new Context("settings menu", "#settings-menu button"));
    attachSettingsListeners();
    settingsVisited = true;
  }

  setContext("settings menu");
}

export function initMenuElements() {
  mainMenu = document.getElementById("main-menu");
  startBtn = document.getElementById("start-btn");
}

function attachSettingsListeners() {
  buttonFlipper.attach();
  
  const sizeSliderTransitioner = new Slider(sizeSlider, normalizeBoard);
  sizeSliderTransitioner.attach();

  attachOutlines();

  attachBackBtnHandler();
}

function attachOutlines() {
  const colorOptionOutline = new Outline("#color-set");
  const themeThumbnailOutline = new Outline("#theme-set", setTheme);

  const colorOptions = [...document.querySelectorAll("input[name='snake-color']")]; 
  const themeOptions = [...document.querySelectorAll("input[name='theme']")];

  colorOptionOutline.attachTo(colorOptions);
  themeThumbnailOutline.attachTo(themeOptions);
}



function attachBackBtnHandler() { // TODO: should close all buttons too
  document.getElementById("back-btn").addEventListener('click', () => {
    mainMenu.style.display = 'flex';
    settingsMenu.style.display = 'none';

    setContext("main menu");
  })
}

















