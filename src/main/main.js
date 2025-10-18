import { board } from "../components/board/board.js";
import { menuButtons } from "../components/menu/elements.js";
import { menuHandlers } from "../components/menu/menu.js";
import { setTheme } from "../common/helpers.js";
import { time } from "../common/variables.js";
import { root } from "../common/elements.js";


setTheme(document.querySelector('input[name="theme"]:checked').value); // set default theme

root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menuButtons.start.addEventListener('click', menuHandlers.startHandler);
menuButtons.settings.addEventListener('click', menuHandlers.settingsHandler);





































