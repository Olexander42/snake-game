import { board, borderEl, backgroundEl } from "../ui/board/board.js";

import { snake, color } from "../components/snake/snake.js";

import { food } from "../components/food/food.js";

import { time, stats, shrinkCounter } from "../common/variables.js";

import { wait } from "../common/utils.js";

import { reset, timeGapUpdate } from "../common/utils.js";

import { snakeControl } from "../controls/button-handlers.js";

import { interval } from "./variables.js";

import { html } from "./elements.js";

function windup() {
  clearInterval(interval.id);

  interval.id = setInterval(() => {
    html.addEventListener('keydown', snakeControl);

    action();
  }, time.gap); 
}

function action() {
  snake.moveHead();

  if (snake.collision()) {
    gameOver(); 
  }

  else {
    snake.bodyFollows();
    
    if ( // snake ate food?
      food.element.style.left === snake.head.style.left 
      && food.element.style.top === snake.head.style.top
    ) levelUp();
      
  }
}

function levelUp() {
  snake.lengthen();
  snake.speed++;

  stats.score++;
  scoreEl.innerText = `Score: ${stats.score}`;

  food.teleport(); 

  shrinkCounter.inner++;
  if (shrinkCounter.inner >= shrinkCounter.outer && !snake.nearOppositeSides()) { // time to shrink?
    board.shrink();

    snake.offsetShrink();
    food.offsetShrink();

    shrinkCounter.inner = 0;
    shrinkCounter.outer++;
  }

  timeGapUpdate();

  windup(); 
}

function gameOver() {
  snake.withdrawHead();

  if (stats.score > stats.record) {
    stats.record = stats.score;
  }

  color.hsl.s *= 0.15;
  snake.repaintBody(time.gap)
    .then(() => wait(1000))
    .then(() => buttons.start.style.display = "block");
}



export { windup }




