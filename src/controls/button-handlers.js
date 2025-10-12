// components
import { board } from "../components/board/board.js";;
import { snake } from "../components/snake/snake.js";
import { food } from "../components/food/food.js";

// common 
import { root, html,  menuButtons, gameMenuDiv, settingsMenuDiv } from "../common/elements.js";
import { raf, states, stats, time } from "../common/variables.js";
import { windup, reset } from "../common/helpers.js";
import { wait } from "../common/utils.js";

// menu
import { buttonSides, sizeSlider } from "../components/menu/elements.js";
import { slider, flipButton } from "../components/menu/helpers.js";


function snakeControl(event) {
  const keydownHandlers = {
    // snake can't hit a border while moving along it and can't turn 180°
    ArrowUp() {
      if (!(parseInt(snake.head.style.top) === board.clip && snake.direction.y === 0 || snake.direction.y === 1)) { 
        snake.turn += -(0.25 * snake.direction.x);

        snake.direction.x = 0;
        snake.direction.y = -1;
      }
    },

    ArrowDown() {
      if (!(parseInt(snake.head.style.top) === board.container.height - board.clip - board.thick && snake.direction.y === 0 || snake.direction.y === -1)) { 
        snake.turn +=  (0.25 * snake.direction.x);

        snake.direction.x = 0;
        snake.direction.y = 1;
      }
    },

    ArrowLeft() {
      if (!(parseInt(snake.head.style.left) === board.clip && snake.direction.x === 0 || snake.direction.x === 1)) {  
        snake.turn +=  (0.25 * snake.direction.y);

        snake.direction.x = -1;
        snake.direction.y = 0;
      }
    },

    ArrowRight() {
      if (!(parseInt(snake.head.style.left) === board.container.width - board.clip - board.thick && snake.direction.x === 0 || snake.direction.x === -1)) {
        snake.turn +=  -(0.25 * snake.direction.y);

        snake.direction.x = 1;
        snake.direction.y = 0;
      }
    },

    Space() {
      if (states.gameActive) {
        cancelAnimationFrame(raf.id);
        states.gameActive = false;
      } else {
        windup();
      }
    },
  }

  if (Object.keys(keydownHandlers).includes(event.code)) {
    event.preventDefault();
    keydownHandlers[event.code]();

    if (event.code !== 'Space') {
      html.removeEventListener('keydown', snakeControl); // only one change per frame is allowed
      states.controlsOn = false;
    }
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
    time.updateGap();
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
