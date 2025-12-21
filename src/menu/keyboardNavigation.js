import { bodyEl, html, settingsMenuBtn } from "../common/elements.js";
import { soundIcon } from "../common/sound.js";

import { contexts, context, addContext, SubContext } from "./context.js";


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
    const isSettingsBtnSide = child.classList.contains("side"); 

    if (isSettingsBtnSide) {
      addContext(new SubContext(context.focusedEl.id, context.focusedEl));
      child.click();
    }
    else context.emulateClick();
  } catch(e) {
    context.emulateClick();
    console.log(e);
  }
}


export const setFocus = () => {}

export function updateFocusibleElements() {}

