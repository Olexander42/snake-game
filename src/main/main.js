import { root } from "../common/elements.js";

import { time } from "../common/variables.js";

import { board } from "../components/board.js";

import { menu } from "../controls/elements.js";

import { menuControl } from "../controls/button-handlers.js";

root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menu.start.button.addEventListener('click', menuControl.startHandler);
menu.settings.button.addEventListener('click', menuControl.settingsHandler);


































