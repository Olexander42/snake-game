// components
import { board } from "../board/board.js";;
import { snake } from "../snake/snake.js";
import { food } from "../food/food.js";

// common 
import { root, html } from "../../common/elements.js";
import { raf, states, stats, time } from "../../common/variables.js";
import { windup, reset } from "../../common/helpers.js";
import { wait } from "../../common/utils.js";

// menu
import { gameMenuDiv, settingsMenuDiv, buttonSides, sizeSlider, menuButtons, colorBoxes  } from "./elements.js";
import { slider, flipButton, closeButtons, moveBoxOutline } from "./helpers.js";

/* something has to be removed 👆 because there's no snakeControl anymore here */

const menuControl = {
  startHandler() {
    if (menuButtons.start.innerText === "Start Again") { // not first game?
      if (stats.score.value > stats.record.value) { // new record?
        stats.record.value = stats.score.value;
        stats.record.element.innerText = "Record: " + stats.record.value;
      }

      reset();
    }

    if (menuButtons.start.innerText === "Start") menuButtons.start.innerText = "Start Again";
    Object.values(menuButtons).forEach((button) => button.style.display = 'none');

    snake.init();
    food.teleport();
    
    // initial food fade-in
    food.element.style.setProperty("--transition", 'opacity 1s linear')
    requestAnimationFrame(() => {
      food.element.style.opacity = 1;
      requestAnimationFrame(() => food.element.style.setProperty("--transition", 'no transition')); 
    })

    windup();
  },

  settingsHandler() {
    gameMenuDiv.style.display = 'none';
    settingsMenuDiv.style.display = 'flex';

    [...buttonSides].forEach((side) => side.addEventListener('click', flipButton));
    board.borderEl.addEventListener('click', closeButtons);

    [...colorBoxes].forEach((box) => box.addEventListener('click', moveBoxOutline));
    colorBoxes[0].dispatchEvent(new Event('click')); // set the outline on the first box (default color)

    sizeSlider.addEventListener('input', () => slider.thumbTransition());
    menuButtons.back.addEventListener('click', menuControl.backHandler);
  },

  backHandler() {
    settingsMenuDiv.style.display = 'none';
    gameMenuDiv.style.display = 'flex';
  }
}


export { menuControl };
