import { bodyEl, html, settingsMenuBtn, backBtn } from "../common/elements.js";
import { soundIcon } from "../common/sound.js";

import { context, addContext, SubContext } from "./context.js";


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

      if (!child || !child.classList.contains("side")) emulateClick(context.focusedEl);
      else child.click() // in settings menu listeners are inside buttons

      break;

    case 'KeyM':
      emulateClick(soundIcon);
      break;

    case 'Escape':
      if (context instanceof SubContext) bodyEl.click();
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


export const setFocus = () => {}

export function updateFocusibleElements() {}

