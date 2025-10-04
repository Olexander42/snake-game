import { board } from "../ui/board/board.js";

import { snake } from "../components/snake/snake.js";

import { windup, reset, timeGapUpdate } from "../common/helpers.js";

import { wait } from "../common/utils.js";

import { root, html } from "../common/elements.js";

import { interval } from "../common/variables.js";

import { menuButtons, menuDiv } from "./elements.js";



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
    if (menuButtons.start.innerText === "Start Again") {
      reset();

      //wait(1000).then(() => board.ini();
    }

    menuButtons.start.innerText = "Start Again";
    Object.values(menuButtons).forEach((button) => button.style.display = 'none');

    snake.ini();

    timeGapUpdate();

    windup();
  },

  settingsHandler() {
    mainMenu.style.display = "none";
    settingsMenu.style.display = "flex"
  },

  sizeHandler() {
    reset();
    sizes.width = Math.floor(menuButtons.size.value / 2) * 2;
    sizes.step = sizes.width / 2;
    root.style.setProperty("--sizes.width", `${sizes.width}px`);
    borderSize("ini");
    game = new SnakeGame();
  },
}

export { snakeControl, menuControl };
