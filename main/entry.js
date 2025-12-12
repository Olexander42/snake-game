import { html } from "../src/common/elements.js"
import { initSoundIconEl, soundIcon, toggleMute } from "../src/common/sound.js";
import setDefaultTheme, { initStyleEl } from "../src/common/theme.js";

import * as Game from "../src/game/game.js";
import { initMenuElements, startBtn, settingsBtn, handleStartBtn, handleSettingsBtn } from "../src/menu/handlers.js";
import handleMenuNavigation, { updateFocusibleElements } from "../src/menu/keyboardNavigation.js";

initStyleEl();
setDefaultTheme();

updateFocusibleElements("main menu");
html.addEventListener('keydown', handleMenuNavigation);

initMenuElements()
startBtn.addEventListener('click', () => handleStartBtn(Game));
settingsBtn.addEventListener('click', handleSettingsBtn);

initSoundIconEl();
soundIcon.addEventListener('click', toggleMute);















































