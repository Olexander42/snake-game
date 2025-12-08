import { attachToggleMuteListener } from "../src/common/sound.js";
import setDefaultTheme from "../src/common/theme.js";
import * as Game from "../src/game/game.js";
import attachMainMenuListeners from "../src/menu/handlers.js";
import { setupMenuNavigation } from "../src/menu/keyboardNavigation.js";


setDefaultTheme();
attachMainMenuListeners(Game);
setupMenuNavigation();
attachToggleMuteListener();














































