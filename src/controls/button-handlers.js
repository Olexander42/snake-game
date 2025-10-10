import { snake } from "../components/snake/snake.js";

import { food } from "../components/food/food.js";

import { board } from "../components/board/board.js";;

import { slider, flipButton } from "../components/menu/helpers.js";

import { buttonSides, sizeSlider } from "../components/menu/elements.js";

import { windup, reset, timeGapUpdate } from "../common/helpers.js";

import { wait } from "../common/utils.js";

import { root, html } from "../common/elements.js";

import { interval, states, stats } from "../common/variables.js";

import { menuButtons, gameMenuDiv, settingsMenuDiv } from "./elements.js";

function snakeControl(event) {
  switch (event.key) {
    // prevent snake from hitting borders up close
    case 'ArrowUp':
      if (!(parseInt(snake.head.style.top) === board.clip && snake.direction.y === 0 || snake.direction.y === 1)) { // top border
        snake.turn += -(0.25 * snake.direction.x);

        snake.direction.x = 0;
        snake.direction.y = -1;

        html.removeEventListener('keydown', snakeControl); // only one change per frame is allowed
      }
      break;

    case 'ArrowRight':
      if (!(parseInt(snake.head.style.left) === board.container.width - board.clip - board.thick && snake.direction.x === 0 || snake.direction.x == -1)) { // top border
        snake.turn +=  -(0.25 * snake.direction.y);

        snake.direction.x = 1;
        snake.direction.y = 0;

        html.removeEventListener('keydown', snakeControl);
      }
      break;

    case 'ArrowDown':
      if (!(parseInt(snake.head.style.top) === board.container.height - board.clip - board.thick && snake.direction.y === 0 || snake.direction.y === -1)) { // bottom border
        snake.turn +=  (0.25 * snake.direction.x);

        snake.direction.x = 0;
        snake.direction.y = 1;

        html.removeEventListener('keydown', snakeControl);
      }
      break;

    case 'ArrowLeft':
      if (!(parseInt(snake.head.style.left) === board.clip && snake.direction.x === 0 || snake.direction.x === 1)) {  // left border
        snake.turn +=  (0.25 * snake.direction.y);

        snake.direction.x = -1;
        snake.direction.y = 0;
 
        html.removeEventListener('keydown', snakeControl);
      }
      break;

    case "p": // pause
      if (interval.id !== 0) {
        clearInterval(interval.id);
        interval.id = 0;
      } else {
        windup();
      }
      break;
  }
}

const menuControl = {
  startHandler() {
    if (menuButtons.start.innerText === "Start Again") { // not first game?
      if (stats.score.value > stats.record.value) { // new record?
        stats.record.value = stats.score.value;
        stats.record.element.innerText = "Record: " + stats.record.value;
      }
      reset();
    }

    menuButtons.start.innerText = "Start Again";
    Object.values(menuButtons).forEach((button) => button.style.display = 'none');

    snake.init();

    food.teleport();

    timeGapUpdate();

    windup();
  },

  settingsHandler() {
    gameMenuDiv.style.display = 'none';
    settingsMenuDiv.style.display = 'flex';

    [...buttonSides].forEach((side) => side.addEventListener('click', flipButton));

    sizeSlider.addEventListener('input', () => slider.thumbTransition());

    menuButtons.back.addEventListener('click', menuControl.backHandler);
  },

  backHandler() {
    settingsMenuDiv.style.display = 'none';
    gameMenuDiv.style.display = 'flex';
  }
}

export { snakeControl, menuControl };
