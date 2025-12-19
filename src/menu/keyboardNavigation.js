import { bodyEl, html } from "../common/elements.js";
import { toggleMute, soundIcon } from "../common/sound.js";


const context = { ctx: null, direction: null };
let focusibleElements = [];
let focusedEl;

const DELAY = 200;

export function handleMenuNavigation(event, isGameActive) {
  if (isGameActive) return;
  
  switch (event.code) {
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
      if (context.ctx === "settings button") bodyEl.click(); // close all buttons

    default:
      // something
  }
}

export function updateFocusibleElements(ctx) { 
  if (context.ctx === ctx) return;
  context.ctx = ctx;
  focusibleElements = [document.querySelector("#sound-icon")];
 
  let selector; 

  switch(context.ctx) {
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

function emulateActiveState(el) {
  el.classList.add("active"); 
  setTimeout(() => el.classList.remove("active"), DELAY);
}


