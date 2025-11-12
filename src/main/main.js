import { board } from "../components/board/Board.js";
import { menuButtons } from "../components/menu/elements.js";
import { menuHandlers } from "../components/menu/menu.js";
import { setTheme } from "../common/helpers.js";
import { sound } from "../common/Sound.js";
import { time } from "../common/variables.js";
import { root, soundIcon } from "../common/elements.js";


setTheme(); 

root.style.setProperty("--size", `${board.thick}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

menuButtons.start.addEventListener('click', menuHandlers.startHandler);
menuButtons.settings.addEventListener('click', menuHandlers.settingsHandler);

soundIcon.addEventListener('click', () => {
  sound.library.bgMusic.play();
}, { once: true });

soundIcon.addEventListener('click', () => {
  sound.toggleMutedState(); 

  if (!soundIcon.classList.replace("sound-off", "sound-on")) {
    soundIcon.classList.replace("sound-on", "sound-off");
  } 
})





































