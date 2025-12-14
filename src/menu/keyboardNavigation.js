import { bodyEl, html } from "../common/elements.js";

const DELAY = 200;

let focusibleElements = [];
let focusedElement;

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

    case 'Enter': // TODO: extact this into a method, probably.
      event.preventDefault();

      // Recreate :active state behavior.
      focusedElement.classList.add("active"); 
      setTimeout(() => focusedElement.classList.remove("active"), DELAY);

        // Listeners in settings menu attached to "sides" of the buttons. 
        if (focusedElement.firstElementChild && focusedElement.firstElementChild.classList.contains("side")) {
          focusedElement.firstElementChild.click();
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

export function updateFocusibleElements(context) { // TODO: Pass "main menu" back after game over. 
  let selector;
  focusibleElements = [document.querySelector("#sound-icon img")];

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



