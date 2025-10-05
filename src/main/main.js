import { root } from "../common/elements.js";

import { time } from "../common/variables.js";

import { board } from "../components/board.js";

import { menuButtons } from "../controls/elements.js";

import { menuControl } from "../controls/button-handlers.js";

root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menuButtons.start.addEventListener('click', menuControl.startHandler);
menuButtons.settings.addEventListener('click', menuControl.settingsHandler);
































