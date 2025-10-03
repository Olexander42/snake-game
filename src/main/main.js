import { board } from "../ui/board/board.js";

import { snake } from "../components/snake/snake.js";

import { food } from "../components/food/food.js";

import { time } from "../common/variables.js"

import { menuButtons } from "../controls/variables.js";

import { menuControl } from "../controls/button-handlers.js";

import { windup } from "./helpers.js";

root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menuButtons.mainMenu.start.addEvenListener('click', menuControl.mainMenu.startHandler);
menuButtons.mainMenu.settings.addEvenListener('click', menuControl.mainMenu.settingsHandler);

















