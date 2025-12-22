import { bodyEl, html, settingsMenuBtn, backBtn } from "../common/elements.js";
import { soundIcon } from "../common/sound.js";

import { context, addContext, switchContext, Context, OptionsButton } from "./context.js";


export function handleMenuNavigation(event, isGameActive) {
  if (isGameActive) return;
  
  const direction = event.code.slice(5, event.code.length);
  switch(event.code) {
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

    case 'KeyM':
      emulateClick(soundIcon);
      break;

    case 'Escape':
      if (context instanceof OptionsButton) bodyEl.click();
      else if (context.name === "settings menu") backBtn.click();

      break;
  }
}

function emulateClick(el) {
  const DELAY = 200;

  el.classList.add("active");  // emulate active state
  setTimeout(() => {
    el.classList.remove("active");
    el.click();
  }, DELAY);
}


