import { board } from "../components/board/board.js";
import { time } from "../common/variables.js";
import { root } from "../common/elements.js";
import { menuButtons } from "../components/menu/elements.js";
import { menuControl } from "../controls/button-handlers.js";


root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menuButtons.start.addEventListener('click', menuControl.startHandler);
menuButtons.settings.addEventListener('click', menuControl.settingsHandler);


































