import { startBtn, settingsBtn, html } from "./src/common/elements.js";
import { toggleMute, soundIcon } from "./src/common/sound.js";
import initTheme from "./src/common/theme.js";
import handleMenuNavigation from "./src/menu/keyboardNavigation.js";
import { handleStartBtn, handleSettingsBtn } from "./src/menu/menu.js";


initTheme();

html.addEventListener('keydown', handleMenuNavigation);
startBtn.addEventListener('click', handleStartBtn);
settingsBtn.addEventListener('click', handleSettingsBtn);
soundIcon.addEventListener('click', toggleMute);














































