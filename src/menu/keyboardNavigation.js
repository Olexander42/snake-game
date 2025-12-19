import { bodyEl, html } from "../common/elements.js";
import { soundIcon } from "../common/sound.js";


const contexts = { 
  "main menu": {
    get focusibleElements() { 
      return (() => {
        let cache;
        return cache ??= [...document.querySelectorAll("#main-menu button")]
      })();
    },
    focusedEl: null,
    direction: "vertical",
  },

  "settings menu": {
    get focusibleElements() { 
      return (() => {
        let cache;
        return cache ??= [...document.querySelectorAll("#settings-menu button")]
      })();
    },
    focusedEl: null,
    direction: "vertical",
  },
} 

//let focusibleElements = [];
//let focusedEl;

export function handleMenuNavigation(code, isGameActive) {
  if (isGameActive) return;
  
  switch (code) {
    case 'ArrowDown': 
      if (context.direction === "vertical") moveFocus("Down");
      break;

    case 'ArrowUp':
      if (context.direction === "vertical") moveFocus("Up");
      break;

    case 'ArrowRight': 
      if (context.direction === "horizontal") moveFocus("Right");
      break;

    case 'ArrowLeft':
      if (context.direction === "horizontal") moveFocus("Left");
      break;

    case 'KeyM':
      emulateMouseClick(soundIcon); 
      break;

    case 'Enter':
      event.preventDefault();
      if (!focusedEl) return;

      // Listeners in settings menu attached to children of the settings buttons. 
      if (context.ctx === "settings menu" && focusedEl.firstElementChild) {
        focusedEl.firstElementChild.click();
      } else emulateMouseClick(focusedEl); 

      break;

    case 'Escape': 
      if (context.ctx === "settings button") bodyEl.click(); // close all buttons
      break;
  }
}

export function updateFocusibleElements(ctx) { 
  focusibleElements = [document.querySelector("#sound-icon")];
 
  let selector; 

  switch(ctx) {
    case "main menu":
      selector = "#main-menu button";
      context.direction = "vertical";
      break;

    case "settings menu":
      selector = "#settings-menu button";
      context.direction = "vertical";
      break;

    case "settings button":
      focusibleElements = []; 
  
      const rearSide = focusedEl.children[1];
      const fieldsetId = rearSide.firstElementChild.id;

      selector = `#${fieldsetId} [tabindex = '0']`;
      context.direction = "horizontal";
      break;
  }

  focusibleElements.unshift(...document.querySelectorAll(selector));  
  focusedEl = null;

  context.ctx = ctx;
  rememberContextFocusedEl();

  console.log("Focusible  Elements:", focusibleElements); 
}

export const setFocus = (el) => {
  focusedEl = el;
  focusedEl.focus();

  console.log("FocusedEl:", focusedEl);
}

function moveFocus(direction) {
  if (focusedEl) focusedEl.classList.remove("focused");

  const INDEX_MIN = 0;
  const INDEX_MAX = focusibleElements.length - 1;

  const increment = (direction === "Down" || direction === "Right") ? 1 : -1;
  const focusedElIndex = focusibleElements.indexOf(focusedEl); 
  const newIndex = focusedElIndex + increment;

  const newIndexSafe = Math.max(Math.min(newIndex, INDEX_MAX), INDEX_MIN); 
  console.log("inside moveFocus()");
  setFocus(focusibleElements[newIndexSafe]);
  focusedEl.classList.add("focused");
}

function rememberContextFocusedEl() {
  for (const el of focusibleElements) {
    if (el.classList.contains("focused")) {
      console.log("inside rememberContextLastFocusedEl");
      setFocus(el);
      break;
    }
  }
}

function emulateMouseClick(el) {
  el.classList.add("active");  // emulate active state
  setTimeout(() => {
    el.classList.remove("active");
    el.click();
  }, 200);
}

export class Context {
  constructor(selector, direction) {
    this.focusibleElements = [...document.querySelectorAll("#main-menu button")];
    this.direction = direction;
    this.focusedEl = null;
  }
}


