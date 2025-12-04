import * as Board from "../components/board.js";
import * as Snake from "../components/snake/snake.js";
//import snakeControls, { isControlsOn asisSnakeControlsOn} from "./components/snake/controls.js";
//import { isCollision, isSnakeNearOppositeBorders } from "./components/snake/collision.js";
//import * as Food from "./components/Food.js";
const Food = null; // mock

import { TIME_UNIT } from "../common/constants.js";
import { root, html, sizeInput, menu } from "../common/elements.js";
//import { sleep } from "./src/common/utils.js";
import { soundLibrary } from "../common/sound.js";


let isActive = false;

export function begin() {
  Board.normalize();
  Snake.spawn();
}

  /*
  Food.teleport(Board.data, Snake.bodyData);
  Food.fadeIn();
  Food.transitionColors();


  //timer.updateGap();
  //action();
}

export function reset() {
  Snake.div.replaceChildren()

  if (stats.isNewRecord()) stats.updateRecord();
  stats.resetScore();

  soundLibrary.bgMusic.play();
}


export function attachControls() {
  html.addEventListener('keydown', (event) => {
    if (event.code === 'Space') togglePause();
    else if (event.code.slice(0, 5) === 'Arrow' && isSnakeControlsOn) { 
      Snake.handleControls(event.code); 
    } 
  })
}


function action() {   
  if (!isSnakeControlsOn) isSnakeControlsOn = true; // ⚠ you can't mutate external values

  const supposedHeadNewCoords = Snake.calcHeadNewCoords();

  if (!isCollision(supposedHeadNewCoords)) {
    Snake.makeStep(supposedHeadNewCoords);

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

  if (isActive) setTimeout(() => action(), timer.gap);
}



function togglePause() {
  if (!isActive) {
    isActive = true;
    isSnakeControlsOn = true;

    action(timer.gap);
  } else {
    isActive = false;
    isSnakeControlsOn = false;
  }
}

function gameOver() {
  soundLibrary.bgMusic.pause();
  soundLibrary.gameOver.play();
  
  isSnakeControlsOn = false;
  
  Snake.greyout(TIME_UNIT);

  setTimeout(() => menu.style.display = 'flex', TIME_UNIT);
}
*/









