import { bodyEl, html, settingsMenuBtn } from "../common/elements.js";
import { soundIcon } from "../common/sound.js";

import { context, addContext, SubContext } from "./context.js";


export function handleMenuNavigation(event, isGameActive) {
  if (isGameActive) return;
  
  switch(event.code) {
    case 'ArrowDown': 
      context.moveFocus("Down");
      break;

    case 'ArrowUp': 
      context.moveFocus("Up");
      break;

    case 'Enter':
      event.preventDefault();

      if (context.name === "settings menu") handleSettingsMenuContext();
      else context.emulateClick();
  }
}

function handleSettingsMenuContext() {
  try {
    // In settings menu listeners are inside buttons
    const child = context.focusedEl.firstElementChild;
    const isBtnSide = child.classList.contains("side"); 

    if (isBtnSide) {
      addContext(new SubContext(context.focusedEl.id, context.focusedEl));
      console.log("contexts:", contexts);
      child.click();
    }
    else context.emulateClick();
  } catch {
    context.emulateClick();
  }
}


export const setFocus = () => {}

export function updateFocusibleElements() {}

