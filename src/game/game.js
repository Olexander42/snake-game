import { TIME_UNIT } from "../common/constants.js";
import { root, html, menu, sizeInput } from "../common/elements.js";
import { soundLibrary } from "../common/sound.js";
import { timer, stats, shrinkCounter } from "./managers.js";

import * as Board from "../components/board.js";

import * as Snake from "../components/snake/snake.js";
import * as CollisionManager from "../components/snake/collision.js";
import * as SnakeControl from "../components/snake/control.js";

//import * as Food from "./components/Food.js"; 
const Food = null; // mock


let isGameActive = true;

export function begin() {
  Board.normalize();
  Snake.spawn();

  /*
  Food.teleport(Board.data, Snake.bodyData);
  Food.fadeIn();
  Food.transitionColors();
  */


  timer.updateGap();
  action();
}

function action() {   
  if (!SnakeControl.isOn) SnakeControl.turnOn();

  if (!CollisionManager.isCollision()) {
    Snake.makeStep();
    /*
    if (Snake.isAteFood(Food.coords)) {
      soundLibrary.bite.play();
      shrinkCounter.inner++;

      if (shrinkCounter.isTimeToShrink() && !isSnakeNearOppositeBorders()) {
        Board.shrink(); 
        Snake.offsetShrink();

        shrinkCounter.incrementOuter();
      }

      stats.incrementScore();

      Food.teleport(Board.data, Snake.bodyData);

      Snake.grow();
      Snake.speedUp();

      timer.updateGap();
    }
    */
    if (isGameActive) setTimeout(() => action(), timer.gap);
  }
}

export function attachControls() {
  html.addEventListener('keydown', ({ code }) => {
    if (code === 'Space') togglePause();
    else if (isGameActive && SnakeControl.isOn && code.slice(0, 5) === "Arrow") SnakeControl.handleKeydown(code); 
  })
}

function togglePause() {
  isGameActive = isGameActive === true ? false : true;
  if (isGameActive) action();
}

function gameOver() {
  soundLibrary.bgMusic.pause();
  soundLibrary.gameOver.play();
  
  Snake.greyout(TIME_UNIT);
  setTimeout(() => menu.style.display = 'flex', TIME_UNIT);
}

export function reset() {
  if (stats.isNewRecord) stats.updateRecord();
  stats.resetScore();

  Snake.disappear();

  soundLibrary.bgMusic.play();
}











