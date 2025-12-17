import { bodyEl, html } from "../common/elements.js";
import { toggleMute, soundIcon } from "../common/sound.js";


let focusibleElements = [];
let focusedEl;

const DELAY = 200;

export default function handleKeydown(event, isGameActive) {
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

      // Listeners in settings menu attached to "sides" of the buttons. 
      const child = focusedEl.firstElementChild; 
      const isSettingsBtnSide = child && child.classList.contains("side");

      if (isSettingsBtnSide) {
        child.click();
        updateFocusibleElements("settings button");  
      } 
      else setTimeout(() => focusedEl.click(), DELAY); 

      emulateActiveState(focusedEl);
      break;

    case 'Escape': 
      bodyEl.click(); // close all buttons
      updateFocusibleElements("settings menu"); 

    default:
      // something
  }
}

export function updateFocusibleElements(context) { 
  let selector; 
  focusibleElements = [document.querySelector("#sound-icon")];

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
  console.log("Focusible Elements:", focusibleElements);
}

function moveFocus(direction) {
  const INDEX_MIN = 0;
  const INDEX_MAX = focusibleElements.length - 1;

  const increment = direction === "Down" ? 1 : -1;
  const focusedElIndex = focusibleElements.indexOf(focusedEl); 
  const newIndex = focusedElIndex + increment;

  const newIndexSafe = Math.max(Math.min(newIndex, INDEX_MAX), INDEX_MIN); 

  focusedEl = focusibleElements[newIndexSafe];
  focusedEl.focus();
}

function emulateActiveState(el) {
  el.classList.add("active"); 
  setTimeout(() => el.classList.remove("active"), DELAY);
}


