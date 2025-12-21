import { root, html,  settingsMenuBtn, sizeSlider } from "../src/common/elements.js";
import { initSoundIconEl, soundIcon, toggleMute } from "../src/common/sound.js";
import setDefaultTheme from "../src/common/theme.js";

import * as Game from "../src/game/game.js";
import { initMenuElements, startBtn, handleStartBtn, handleSettingsMenuBtn } from "../src/menu/handlers.js";
import { handleMenuNavigation } from "../src/menu/keyboardNavigation.js";
import { Context, addContext, switchContext } from "../src/menu/context.js";


root.style.setProperty("--size", `${sizeSlider.value}px`);

setDefaultTheme();

addContext(new Context("main menu", "#main-menu button"));
switchContext("main menu");
html.addEventListener('keydown', (event) => handleMenuNavigation(event, Game.isGameActive));

initMenuElements();
startBtn.addEventListener('click', () => handleStartBtn(Game));
settingsMenuBtn.addEventListener('click', handleSettingsMenuBtn);

initSoundIconEl();
soundIcon.addEventListener('click', toggleMute);
































