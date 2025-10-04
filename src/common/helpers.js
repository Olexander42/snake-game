import { board } from "../ui/board/board.js";

import { snake } from "../components/snake/snake.js";

import { food } from "../components/food/food.js";

import { snakeControl } from "../controls/button-handlers.js";

import { menuButtons } from "../controls/elements.js";

import { root, html } from "./elements.js";

import { interval, time, stats, shrinkCounter } from "./variables.js";

import { wait } from "./utils.js";

function windup() {
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
  clearInterval(interval.id);

  snake.withdrawHead();

  if (stats.score > stats.record) {
    stats.record = stats.score;
  }

  snake.color.hsl.s *= 0.15;
  snake.repaintBody(time.gap)
    .then(() => wait(1000))
    .then(() => menuButtons.start.style.display = "block");
}

function reset() {
  snake.div.replaceChildren(); // delete snake

  // back to initial size
  board.borderEl.style.width = board.container.width;
  board.borderEl.style.height = board.container.height;
  board.backgroundEl.style.clipPath = "";

  board.clip = board.thick;

  stats.score = 0;

  shrinkCounter.reset();

  timeGapUpdate();

  //root.style.setProperty("--turn", ""); // ❓
}

function timeGapUpdate() {
  time.gap = Math.round(time.unit / snake.speed);
  root.style.setProperty("--time-gap", `${time.gap / 1000}s`);
}

export { windup, action, levelUp, reset, timeGapUpdate };