import { bodyEl, html } from "../common/elements.js";
import { toggleMute, soundIcon } from "../common/sound.js";


let focusibleElements = [];
let focusedEl;
let context;

const DELAY = 200;

export function handleMenuNavigation(event, isGameActive) {
  if (isGameActive) return;

  switch (event.code) {
    case 'ArrowRight':
    case 'ArrowDown': 
      moveFocus("Down");
      break;

    case 'ArrowLeft':
    case 'ArrowUp':
      moveFocus("Up");
      break;

    case 'KeyM':
      emulateActiveState(soundIcon);
      toggleMute();
      break;

    case 'Enter':
      event.preventDefault();
      if (!focusedEl) return;

      // Listeners in settings menu attached to "sides" of the buttons. 
      const child = focusedEl.firstElementChild; 
      const isSettingsBtnSide = child && child.classList.contains("side");

      if (isSettingsBtnSide) {
        child.click();
      } 
      else {
        emulateActiveState(focusedEl);
        setTimeout(() => focusedEl.click(), DELAY); 
      }
      break;

    case 'Escape': 
      if (context === "settings button") bodyEl.click(); // close all buttons

    default:
      // something
  }
}

export function updateFocusibleElements(ctx) { 
  context = ctx;
  focusibleElements = [document.querySelector("#sound-icon")];
 
  let selector; 

  switch(context) {
    case "main menu":
      selector = "#main-menu button";
      break;

    case "settings menu":
      selector = "#settings-menu button";
      break;

    case "settings button":
      focusibleElements = []; 
  
      const rearSide = focusedEl.children[1];
      const fieldsetId = rearSide.firstElementChild.id;

      selector = `#${fieldsetId} [tabindex = '0']`;
      break;
  }

  focusibleElements.unshift(...document.querySelectorAll(selector));  
  focusedEl = null;
  for (const el of focusibleElements) {
    if (el.classList.contains("focused")) {
      setFocus(el);
      break;
    }
  }
  console.log("Focusible  Elements:", focusibleElements); 
}

export const setFocus = (el) => {
  if (focusedEl) focusedEl.classList.remove("focused");

  focusedEl = el;
  focusedEl.focus();

  focusedEl.classList.add("focused"); 
  console.log("FocusedEl:", focusedEl);
}

function moveFocus(direction) {
  const INDEX_MIN = 0;
  const INDEX_MAX = focusibleElements.length - 1;

  const increment = direction === "Down" ? 1 : -1;
  const focusedElIndex = focusibleElements.indexOf(focusedEl); 
  const newIndex = focusedElIndex + increment;

  const newIndexSafe = Math.max(Math.min(newIndex, INDEX_MAX), INDEX_MIN); 

  setFocus(focusibleElements[newIndexSafe]);
}

export function attachClickToFocus() {
  const allFocusibleElements = document.querySelectorAll("button, option, .optionm");
  allFocusibleElements.forEach((el) => el.addEventListener('click', ({ currentTarget }) => {
    setFocus(currentTarget);
  }))
}

function emulateActiveState(el) {
  el.classList.add("active"); 
  setTimeout(() => el.classList.remove("active"), DELAY);
}


