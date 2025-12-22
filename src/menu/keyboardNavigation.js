import { bodyEl, html, settingsMenuBtn, backBtn } from "../common/elements.js";
import { emulateClick } from "../common/utils.js";
import { soundIcon } from "../common/sound.js";

import { context, addContext, switchContext, Context, OptionsButton } from "./context.js";


export function handleMenuNavigation(event, isGameActive) { 
  if (isGameActive) return;

  const keydown = event.code;
  let direction;
  
  if (keydown.slice(0, 5) === "Arrow") direction = keydown.slice(5, keydown.length);

  switch(keydown) {
    case 'ArrowUp': 
    case 'ArrowDown':
      if (context instanceof OptionsButton) switchContext("settings menu");
      context.moveFocus(direction);
      break;

    case 'ArrowLeft': 
    case 'ArrowRight':
      if (context.name === "settings menu" && context.focusedEl?.classList.contains("clicked")) {
        switchContext(context.focusedEl.id);
      } 

      context.moveFocus(direction);
      break;

    case 'Enter':
    case 'Space':
      event.preventDefault();

      // in settings menu listeners are inside buttons
      const child = context.focusedEl.firstElementChild;
      if (child?.classList.contains("side")) {
        child.click(); 
        return;
      }

      emulateClick(context.focusedEl);
      break;

    case 'Escape':
      if (context instanceof OptionsButton) bodyEl.click();
      else if (context.name === "settings menu") backBtn.click();

      break;
  }
}




