import { TIME_UNIT } from "../common/constants.js";
import { root, html, menu } from "../common/elements.js";
import { soundLibrary } from "../common/sound.js";
import { timer, stats, shrinkCounter } from "./managers.js";

import * as Board from "../components/board.js";
import * as Food from "../components/food.js"; 
import * as Snake from "../components/snake/API.js";

let isGameActive = true;

export function begin() { 
  Board.normalize();

  Snake.spawn(Board.center);

  const snakeCoords = Snake.data.map(({ x, y }) => ({ x, y }))
  Food.spawn(snakeCoords);
  
  //Food.transitionColors();
  
  timer.updateGap(speed);
  action();
}

export function attachControls() {
  html.addEventListener('keydown', ({ code }) => {
    if (code === 'Space') togglePause();
    else if (isGameActive && SnakeControl.isOn && code.slice(0, 5) === "Arrow") SnakeControl.handleKeydown(code); 
  })
}

function action() {   
  if (!Snake.isControlsOn) Snake.turnOnControls();

  if (!Snake.isCollision()) {
    Snake.makeStep(Snake.newHeadCoords);
    if (Snake.isAteFood(Food.coords)) {
      if (shrinkCounter.isTimeToShrink() && !isSnakeNearOppositeBorders()) {
        Board.shrink(); 
        Snake.offsetShrink();

        shrinkCounter.incrementOuter();
      }
      stats.incrementScore();
      Food.teleport(Board.data, Snake.bodyData);

      Snake.grow();
      Snake.rescaleSections()

      timer.speedUp();
      timer.updateGap();
    }
    */
    if (isGameActive) setTimeout(() => action(), timer.gap);
  }
}



const isSnakeAteFood = () => Snake.getHeadData.x === Food.coords.x && Snake.getHeadData.y === Food.coords.y;

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

  Snake.emptyOut();

  soundLibrary.bgMusic.play();
}











