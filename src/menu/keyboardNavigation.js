import { bodyEl, html } from "../common/elements.js";
import { toggleMute, soundIcon } from "../common/sound.js";


let focusibleElements = [];
let focusedElement;

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

    case 'Enter': // TODO: extact this into a method, probably.
      event.preventDefault();
      emulateActiveState(focusedElement);

      // Listeners in settings menu attached to "sides" of the buttons. 
      const child = focusedElement.firstElementChild;
      const isSettingsBtnSide = child && child.classList.contains("side");

      if (isSettingsBtnSide) {
        child.click();
        updateFocusibleElements("settings button");  
      } 
      else setTimeout(() => focusedElement.click(), DELAY); // test it
  
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

    case "settings button": // FIX: Can't change theme with keyboard
      focusibleElements = []; 
      selector = "button [tabindex = '0']";
      break;
  }

  focusibleElements.unshift(...document.querySelectorAll(selector));  
  console.log("Focusible Elements:", focusibleElements);
}

function moveFocus(direction) {
  const increment = direction === "Down" ? 1 : -1;
  const focusedElementIndex = focusibleElements.indexOf(focusedElement); 
  const newFocusedElementIndex = Math.max(Math.min(focusedElementIndex + increment, focusibleElements.length - 1) , 0); 

  focusedElement = focusibleElements[newFocusedElementIndex];
  focusedElement.focus();
}

function emulateActiveState(el) {
  console.log(el);
  el.classList.add("active"); 
  setTimeout(() => el.classList.remove("active"), DELAY);
}


