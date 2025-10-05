import { board } from "../components/board.js";

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

  stats.score.value++;
  stats.score.element.innerText = `Score: ${stats.score.value}`;

  shrinkCounter.inner++;
  if (shrinkCounter.inner >= shrinkCounter.outer && !snakeIsNearOppositeSides()) { // time to shrink?
    board.shrink();

    offsetShrink(); // no need to offset food?

    shrinkCounter.inner = 0;
    shrinkCounter.outer++;
  }

  food.teleport();

  timeGapUpdate();

  clearInterval(interval.id);

  windup(); 
}

function gameOver() {
  clearInterval(interval.id);

  // withdraw head from collision
  snake.head.style.left = `${parseInt(snake.head.style.left) - snake.direction.x * board.step}px`;
  snake.head.style.top = `${parseInt(snake.head.style.top) - snake.direction.y * board.step}px`;

  snake.color.hsl.s *= 0.15;
  snake.repaintBody(time.gap)
    .then(() => wait(1000))
    .then(() => menuButtons.start.style.display = "block");
}

function reset() {
  snake.div.replaceChildren(); // delete snake

  // back to initial size
  board.borderEl.style.width = board.container.width + "px";
  board.borderEl.style.height = board.container.height + "px";
  board.backgroundEl.style.clipPath = "";

  board.clip = board.thick;

  stats.score.value = 0;

  shrinkCounter.reset();

  timeGapUpdate();
}

function timeGapUpdate() {
  time.gap = Math.round(time.unit / snake.speed);
  root.style.setProperty("--time-gap", `${time.gap / 1000}s`);
}

function snakeIsNearOppositeSides() {
  return (
    (snake.snakeBodyData.some((coord) => (parseInt(coord.top) <= board.clip + board.step )
    && snake.snakeBodyData.some((coord) => (parseInt(coord.top) >= board.container.height - board.clip - board.thick - board.step))))  // near top-bottom border
    || ((snake.snakeBodyData.some((coord) => (parseInt(coord.left) <= board.clip + board.step))) 
    && (snake.snakeBodyData.some((coord) => parseInt(coord.left) >= board.container.width - board.clip - board.thick - board.step))) // near lef-right border
  )
}

function offsetShrink() {
  //snake._snapshot();

  // if snake inside top border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.top) < board.clip + board.step))) {
    snake.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + board.step + "px" );
    console.log("snake inside top border")
  }

  // if snake inside bottom border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.top) > board.container.height - board.clip - board.step))) {
    snake.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - board.step + "px" );
    console.log("snake inside bottom border")
  }

  // if snake inside left border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.left) < board.clip + board.step))) {
    snake.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + board.step + "px" );
    console.log("snake inside left border")
  }
  
  // if snake inside right border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.left) > board.container.width - board.clip - board.width))) {
    snake.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - board.step + "px" );
    console.log("snake inside right border")
  }

  // if food inside top border
  if (parseInt(food.element.style.top) <= board.clip) {
    food.element.style.top = parseInt(food.element.style.top) + board.thickness + "px";
  } 

  // if food inside bottom border
  if (parseInt(food.element.style.top) >= board.container.height - board.clip) {
    food.element.style.top = parseInt(food.element.style.top) - board.thickness + "px";
  } 

  // if food inside right border
  if (parseInt(food.element.style.left) >= board.container.width - board.clip) {
    food.element.style.left = parseInt(food.element.style.left) - board.thickness + "px";
  }

  // if food inside left border
  if (parseInt(food.element.style.left) < board.clip) {
    food.element.style.left = parseInt(food.element.style.left) + board.thickness + "px";
  }
  //ateFood(); // in case snake eats food during the offset process // find a way to implement it
}


export { windup, action, levelUp, reset, timeGapUpdate };