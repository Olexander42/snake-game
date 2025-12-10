import { html } from "../src/common/elements.js"
import { attachToggleMuteListener } from "../src/common/sound.js";
import setDefaultTheme from "../src/common/theme.js";
import attachMainMenuListeners from "../src/menu/handlers.js";
import handleMenuNavigation, { updateFocusibleElements } from "../src/menu/keyboardNavigation.js";


setDefaultTheme();

attachMainMenuListeners();

updateFocusibleElements("main menu");
html.addEventListener('keydown', handleMenuNavigation);

attachToggleMuteListener();














































