import { bodyEl, html, settingsMenuBtn } from "../common/elements.js";
import { soundIcon } from "../common/sound.js";

import { contexts, context, addContext, SubContext } from "./context.js";


export function handleMenuNavigation(event, isGameActive) {
  if (isGameActive) return;
  
  switch(event.code) {
    case 'ArrowUp': 
      context.moveFocus("Up");
      break;

    case 'ArrowDown': 
      context.moveFocus("Down");
      break;

    case 'ArrowLeft': 
      context.moveFocus("Left");
      break;

    case 'ArrowRight': 
      context.moveFocus("Right");
      break;

    case 'Enter':
      event.preventDefault();

      const child = context.focusedEl.firstElementChild;

      if (!child || !child.classList.contains("side")) context.emulateClick();
      else child.click() // in settings menu listeners are inside buttons

      break;

    case 'Escape':
      if (context.name !== "main menu") bodyEl.click();
      break;
  }
}


export const setFocus = () => {}

export function updateFocusibleElements() {}

