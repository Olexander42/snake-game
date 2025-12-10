import { html } from "../src/common/elements.js"
import { initSoundIcon, soundIcon, toggleMute } from "../src/common/sound.js";
import setDefaultTheme, { initStyle } from "../src/common/theme.js";
import { initMenuElements, startBtn, settingsBtn, handleStartBtn, handleSettingsBtn } from "../src/menu/handlers.js";
import handleMenuNavigation, { updateFocusibleElements } from "../src/menu/keyboardNavigation.js";

initStyle();
setDefaultTheme();

updateFocusibleElements("main menu");
html.addEventListener('keydown', handleMenuNavigation);

initMenuElements()
startBtn.addEventListener('click', handleStartBtn);
settingsBtn.addEventListener('click', handleSettingsBtn);



initSoundIcon();
soundIcon.addEventListener('click', toggleMute);














































