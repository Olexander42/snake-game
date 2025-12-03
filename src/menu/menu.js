import { body, border, html, menu, mainMenuDiv, settingsDiv, sizeInput, startBtn } from "../common/elements.js";
import setTheme from "../common/theme.js";
import { normalize as normalizeBoard } from "../components/board.js";
//import * as Game from "../game.js";
const Game = null; // mock
import { updateFocusibleElements } from "./keyboardNavigation.js";
import { buttonFlipper, sizeSlider, Outline } from "./components.js";

let firstStart = true; 
let settingsVisited = false;

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

export function handleSettingsBtn() {
  mainMenuDiv.style.display = 'none';
  settingsDiv.style.display = 'flex';

  updateFocusibleElements("settings menu");

  if (!settingsVisited) { 
    settingsVisited = true;

    const colorOptionOutline = new Outline("#color-set");
    const themeThumbnailOutline = new Outline("#theme-set", (value) => setTheme(value));

    colorOptionOutline.attachTo([...document.querySelectorAll("input[name='color']")]);
    themeThumbnailOutline.attachTo([...document.querySelectorAll("input[name='theme']")]);

    buttonFlipper.attach();
    sizeSlider.attach();

    document.getElementById("back-btn").addEventListener('click', () => {
      settingsDiv.style.display = 'none';
      mainMenuDiv.style.display = 'flex';

      updateFocusibleElements("main menu");
    });
  }
}














