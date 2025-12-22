import { root, html,  settingsMenuBtn, sizeSlider } from "../src/common/elements.js";
import { emulateClick } from "../src/common/utils.js";
import { initSoundIconEl, soundIcon, toggleMute } from "../src/common/sound.js";
import setDefaultTheme from "../src/common/theme.js";

import * as Game from "../src/game/game.js";
import { initMenuElements, startBtn, handleStartBtn, handleSettingsMenuBtn } from "../src/menu/handlers.js";
import { handleMenuNavigation } from "../src/menu/keyboardNavigation.js";
import { Context, addContext, switchContext } from "../src/menu/context.js";


root.style.setProperty("--size", `${sizeSlider.value}px`);

setDefaultTheme();

initMenuElements();
startBtn.addEventListener('click', () => handleStartBtn(Game));
settingsMenuBtn.addEventListener('click', handleSettingsMenuBtn);

initSoundIconEl();
soundIcon.addEventListener('click', toggleMute);

addContext(new Context("main menu", "#main-menu button"));
switchContext("main menu");
html.addEventListener('keydown', (event) => {
  if (event.code === 'KeyM') emulateClick(soundIcon);
  else handleMenuNavigation(event, Game.isGameActive);
});



































