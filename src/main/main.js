import { board } from "../components/board/Board.js";
import { menuButtons } from "../components/menu/elements.js";
import { menuHandlers } from "../components/menu/menu.js";
import { setTheme } from "../common/helpers.js";
import { soundLibrary } from "../common/Sound.js";
import { time } from "../common/variables.js";
import { root, soundToggle } from "../common/elements.js";


setTheme(); 

soundLibrary.playMenuMusic();

root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menuButtons.start.addEventListener('click', menuHandlers.startHandler);
menuButtons.settings.addEventListener('click', menuHandlers.settingsHandler);

soundToggle.addEventListener('click', () => {
  if (!soundToggle.classList.replace("sound-off", "sound-on")) soundToggle.classList.replace("sound-on", "sound-off");
})





































