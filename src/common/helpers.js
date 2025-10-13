// components
import { board } from "../components/board/board.js";
import { snake } from "../components/snake/snake.js";
import { food } from "../components/food/food.js";

// functions 
import { snakeControl } from "../controls/button-handlers.js";
import { wait } from "./utils.js";

// variables
import { raf, states, time, stats, shrinkCounter } from "./variables.js";

// elements 
import { root, html } from "./elements.js";
import { menuButtons } from "../components/menu/elements.js";



function windup() {
  const initTimer = (t, f) => {
    let start = t;
    f(t, start);
  }

  const nextStep = (t, start) => {
    const timeElapsed = t - start;
    if (timeElapsed >= time.gap) { // time for a move
      // update states
      if (!states.gameActive) states.gameActive = true;
      if (!states.controlsOn) {
        html.addEventListener('keydown', snakeControl);
        states.controlsOn = true;
      }

      action();    
      if (raf.id !== "game over") initTimer(t, nextStep); // restart the countdown to the next move
    } else {
      raf.id = requestAnimationFrame((t) => nextStep(t, start)); 
    }
  }

  const nextColor = (t, start) => {
    const timeElapsed = t - start;

    if (timeElapsed >= 1000) {
      food.changeColor();
      initTimer(t, nextColor); // restart the countdown to the next color change
    } else {
      requestAnimationFrame((t) => nextColor(t, start));
    }
  }

  requestAnimationFrame((timestamp) => {
    initTimer(timestamp, nextColor);
    initTimer(timestamp, nextStep);
  });
}

function action() {
  snake.moveHead();
  if (snake.collision()) gameOver();
  else {
    snake.bodyFollows();

    if (food.element.style.left === snake.head.style.left && food.element.style.top === snake.head.style.top) {
      levelUp(); 
    }
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
  time.updateGap();
}

function gameOver() {
  raf.id = "game over";
  
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
  food.element.style.opacity = 0; // hide food till the next game begins

  time.reset();

  // back to initial size
  board.borderEl.style.width = board.container.width + "px";
  board.borderEl.style.height = board.container.height + "px";
  board.backgroundEl.style.clipPath = "";
  board.clip = board.thick;

  shrinkCounter.reset();

  stats.score.value = 0;
  stats.score.element.innerText = "Score: 0";  
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
  // if snake inside top border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.top) < board.clip + board.step))) { // top border
    snake.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + board.step + "px" );
  }

  // if snake inside bottom border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.top) > board.container.height - board.clip - board.thick))) { // bottom border
    snake.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - board.step + "px" );
  }

  // if snake inside left border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.left) < board.clip + board.step))) { // left border
    snake.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + board.step + "px" );
  }
  
  // if snake inside right border
  if (snake.snakeBodyData.some((coord) => (parseInt(coord.left) > board.container.width - board.clip - board.thick))) { // right border
    snake.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - board.step + "px" );
  }
  /*
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
  */
}


export { windup, action, levelUp, reset };