import { background, border, html, style } from "../common/elements.js";


function setTheme(theme) {
  html.style.setProperty('background-image', `url(./assets/${theme}/images/outside.jpg)`);
  border.style.setProperty('border-image-source', `url(./assets/${theme}/images/border.jpg)`);
  background.style.setProperty('background-image', `url(./assets/${theme}/images/inside.jpg)`);

  style.innerHTML = `
    @font-face {
      font-family: "main";
      src: url("./assets/${theme}/fonts/main.woff2") format('woff2');
    }

    @font-face {
      font-family: "secondary";
      src: url("./assets/${theme}/fonts/secondary.woff2") format('woff2');
    }

    @font-face {
      font-family: "score";
      src: url("./assets/${theme}/fonts/score.woff2") format('woff2');
    }
  `
}

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

/*


windup() {
  const initTimer = (timestamp, f) => {
    let start = timestamp;
    f(timestamp, start);
  }

  const nextStep = (timestamp, start) => {
    const timeElapsed = timestamp - start;
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

    if (timeElapsed >= TIME_UNIT * 2) {
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

    if (snakeAteFood()) {
      sound.library.bite.play();

      levelUp();   
    }
  }
}

function snakeAteFood() {
  return (food.element.style.left === snake.head.style.left && food.element.style.top === snake.head.style.top);
}

function levelUp(snake,food, board) {
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

  food.generateRandomCoords(snake.bodyData);
  food.teleport();
  time.updateGap(snake.speed);
}

function gameOver() {
  sound.library.bgMusic.pause();
  sound.library.gameOver.play();

  raf.id = "game over";
  
  // withdraw head from collision
  snake.head.style.left = `${parseInt(snake.head.style.left) - snake.direction.x * board.step}px`;
  snake.head.style.top = `${parseInt(snake.head.style.top) - snake.direction.y * board.step}px`;

  snake.color.hsl.s *= 0.15; 
  snake.repaintBody(time.gap)
    .then(() => wait(TIME_UNIT))
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
}

function isCoordsInsideArray(x, y, array) {
  return array.some((section, i) => (i !== 0 && (x === section.x && y === section.y)));
}
*/

export { setTheme };