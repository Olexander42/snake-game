import { root, html, sizeSlider } from "../src/common/elements.js";
import { initSoundIconEl, soundIcon, toggleMute } from "../src/common/sound.js";
import setDefaultTheme from "../src/common/theme.js";

import * as Game from "../src/game/game.js";
import { initMenuElements, startBtn, settingsMenuBtn, handleStartBtn, handlesettingsMenuBtn } from "../src/menu/handlers.js";
import { handleMenuNavigation, updateFocusibleElements } from "../src/menu/keyboardNavigation.js";

root.style.setProperty("--size", `${sizeSlider.value}px`);

setDefaultTheme();

updateFocusibleElements("main menu");
html.addEventListener('keydown', (event) => handleMenuNavigation(event, Game.isGameActive));

initMenuElements();
startBtn.addEventListener('click', () => handleStartBtn(Game));
settingsMenuBtn.addEventListener('click', handlesettingsMenuBtn);

initSoundIconEl();
soundIcon.addEventListener('click', toggleMute);
































