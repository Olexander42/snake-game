import { reset, timeGapUpdate } from "../common/helpers.js";

import { wait } from "../../common/utils.js";

import { snake } from "../components/snake.js";

import { menuButtons, menuDiv } from "./elements.js";



function snakeControl(event) {
  switch (event.key) {
    // prevent snake from hitting borders up close
    case 'ArrowUp':
      if (!(parseInt(snake.head.style.top) === board.clip && snake.direction.y === 0 || snake.direction.y === 1)) { // top border
        snake.turn += -(0.25 * snake.direction.x);

        snake.direction.x = 0;
        snake.direction.y = -1;

        html.removeEventListener('keydown', controls); // only one change per frame is allowed
      }
      break;

    case 'ArrowRight':
      if (!(parseInt(snake.head.style.left) === board.container.width - board.clip - board.thick && snake.direction.x === 0 || snake.direction.x == -1)) { // top border
        snake.turn +=  -(0.25 * snake.direction.y);

        snake.direction.x = 1;
        snake.direction.y = 0;

        html.removeEventListener('keydown', controls);
      }
      break;

    case 'ArrowDown':
      if (!(parseInt(snake.head.style.top) === board.container.height - board.clip - board.thick && snake.direction.y === 0 || snake.direction.y === -1)) { // bottom border
        snake.turn +=  (0.25 * snake.direction.x);

        snake.direction.x = 0;
        snake.direction.y = 1;

        html.removeEventListener('keydown', controls);
      }
      break;

    case 'ArrowLeft':
      if (!(parseInt(snake.head.style.left) === board.clip && snake.direction.x === 0 || snake.direction.x === 1)) {  // left border
        snake.turn +=  (0.25 * snake.direction.y);

        snake.direction.x = -1;
        snake.direction.y = 0;
 
        html.removeEventListener('keydown', controls);
      }
      break;

    case "p": // pause
      if (interval.id !== 0) {
        clearInterval(interval.id);
        interval.id = 0;
      } else {
        windup(time.gap);
      }
      break;
  }
}

const menuControl = {
  mainMenu: {
    startHandler() {
      if (buttons.start.innerText === "Start Again") {
        reset();

        wait(1000).then(() => board.ini())
      }

      buttons.start.innerText = "Start Again";
      menuDiv.style.display = 'none';

      snake.ini();

      timeGapUpdate();

      windup();
    },

    settingsHandler() {
      mainMenu.style.display = "none";
      settingsMenu.style.display = "flex"
    },
  }

  settings: {
    sizeHandler() {
      reset();
      sizes.width = Math.floor(buttons.size.value / 2) * 2;
      sizes.step = sizes.width / 2;
      root.style.setProperty("--sizes.width", `${sizes.width}px`);
      borderSize("ini");
      game = new SnakeGame();
    }
  }

}

export { snakeControl, menuControl };
