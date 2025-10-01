import { sizes, time } from "./variables.js";

root.style.setProperty("--size", `${sizes.width}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

/*
function windup() {
  interval.id = setInterval(() => {
    html.addEventListener("keydown", controls);

    snake.action();
  }, time.gap); 
}

function action() {
  snake.moveHead();
  if (snake.collision()) {
    clearInterval(interval.id);
    gameOver(); 
  }
  else {
    snake.bodyFollows();
    if (food.style.left === game.head.style.left && food.style.top === game.head.style.top) { // if ate food
      ateFood();

      clearInterval(interval.id);

      windup(); 

      snake.repaintBody();
    }
  }
}
*/












