import { startBtn, settingsBtn, html } from "../src/common/elements.js";
import { toggleMute, soundIcon } from "../src/common/sound.js";
import initDefaultTheme from "../src/common/theme.js";
import { init as initBoardElements } from "../src/components/board.js";
import handleMenuNavigation, { updateFocusibleElements } from "../src/menu/keyboardNavigation.js";
import { handleStartBtn, handleSettingsBtn } from "../src/menu/handlers.js";

initBoardElements();
initDefaultTheme();

updateFocusibleElements("main menu");
html.addEventListener('keydown', handleMenuNavigation);
startBtn.addEventListener('click', handleStartBtn);
settingsBtn.addEventListener('click', handleSettingsBtn);
soundIcon.addEventListener('click', toggleMute);














































