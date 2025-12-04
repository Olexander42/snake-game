import { body } from "../common/elements.js";

let focusibleElements = [];
let focusedElement = null;

export default function handleInput() {
  const DELAY = 200;

  switch (event.code) {
    case 'ArrowRight':
    case 'ArrowDown': 
      moveFocus("Down");
      break;

    case 'ArrowLeft':
    case 'ArrowUp':
      moveFocus("Up");
      break;

    case 'Enter':
      event.preventDefault();

      focusedElement.classList.add("active"); // recreate :active state behavior
      setTimeout(() => {
        focusedElement.classList.remove("active");
        
        // Listeners in settings menu attached to "sides" of the buttons
        if (focusedElement.firstElementChild && focusedElement.firstElementChild.classList.contains("side")) {
          focusedElement.firstElementChild.click();
          updateFocusibleElements("settings button");  
        } 
        else focusedElement.click();
      }, DELAY);
      break;

    case 'Escape': 
      // close all buttons
      body.click();
      updateFocusibleElements("settings menu"); 
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

    case "settings button":
      focusibleElements = []; 
      selector = "button [tabindex = '0']";
      break;

    default:
      focusibleElements = []; // turn off keyboard navigation 
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



