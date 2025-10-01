import { borderEl, backgroundEl, root } from "./elements.js";

import { sizes, time, snake } from "./variables.js";



function reset() {
  borderEl.style.width = container.width;
  borderEl.style.height = container.height;

  backgroundEl.style.clipPath = "";
  sizes.clip = sizes.width;

  stats.score = 0;

  time.gap = 1000;

  document.querySelectorAll(".block").forEach((el) => el.remove())

  root.style.setProperty("--turn", "");
}

function ateFood() {
  moveFood();

  snake.lengthenSnake();
  snake.speed++;

  timeGapUpdate();

  checkShrinkBorder();

  stats.score++;
  scoreEl.innerText = `Score: ${stats.score}`;
}

function timeGapUpdate() {
  time.gap = Math.round(time.unit / game.speed);
  root.style.setProperty("--time-gap", `${time.gap / 1000}s`);
}

function gameOver() {
  // "withdraw" snake from the point of collision
  snake.head.style.left = `${parseInt(snake.head.style.left) - snake.direction.x * sizes.step}px`;
  snake.head.style.top = `${parseInt(snake.head.style.top) - snake.direction.y * sizes.step}px`;

  if (stats.score > stats.record) {
    stats.record = stats.score;
  }

  hslMain.s *= 0.15;
  snake.repaintBody(time.gap)
    .then(() => wait(1000))
    .then(() => buttons.start.style.display = "block");
}

function controls(event) {
  switch (event.key) {
    // prevent snake from hitting borders up close
    case "ArrowUp":
      if (!(parseInt(game.head.style.top) === sizes.clip && game.direction.y === 0 || game.direction.y === 1)) { // top border
        game.turn += -(0.25 * game.direction.x);

        game.direction.x = 0;
        game.direction.y = -1;

        html.removeEventListener("keydown", handleKeydown); // only one change per frame is allowed
      }
      break;

    case "ArrowRight":
      if (!(parseInt(game.head.style.left) === container.width - sizes.clip - sizes.width && game.direction.x === 0 || game.direction.x == -1)) { // top border
        game.turn +=  -(0.25 * game.direction.y);

        game.direction.x = 1;
        game.direction.y = 0;

        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (!(parseInt(game.head.style.top) === container.height - sizes.clip - sizes.width && game.direction.y === 0 || game.direction.y === -1)) { // bottom border
        game.turn +=  (0.25 * game.direction.x);

        game.direction.x = 0;
        game.direction.y = 1;

        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowLeft":
      if (!(parseInt(game.head.style.left) === sizes.clip && game.direction.x === 0 || game.direction.x === 1)) {  // left border
        game.turn +=  (0.25 * game.direction.y);

        game.direction.x = -1;
        game.direction.y = 0;
 
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "p": // pause
      if (gameState.active === true) {
        clearInterval(intervalId);
        gameState.active = false;
      } else {
        windup(time.gap);
      }
      break;
  }
}

