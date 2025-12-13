import { TIME_UNIT } from "../common/constants.js";
import { root, html, menu } from "../common/elements.js";
import { soundLibrary } from "../common/sound.js";

import * as Board from "../components/board.js";
import * as Snake from "../components/snake/API.js";
//import * as Food from "../components/food/API.js"; 

import { timer, stats, shrinkCounter } from "./managers.js";


let isGameActive = true;

export function begin() { 
  Board.normalize();

  Snake.setBorders(Board.getBorders());
  Snake.spawn(Board.center);

  //Food.init(Snake.bodyData);
  
  //Food.transitionColors();
  
  timer.updateGap(Snake.speed);
  action();
}


export function attachControls() {
  html.addEventListener('keydown', ({ code }) => {
    if (code === 'Space') togglePause();
    else if (code === 'KeyG') Snake.levelUp();
    else if (code === 'KeyS') {
      if (!Snake.isNearOppositeBorders()) {
        console.log(Snake.isNearOppositeBorders());
        Board.shrink();
        Snake.offsetShrink(Board.getBorders());
      }
    }
    else if (isGameActive) Snake.handleKeydown(code); 
  })
}

function action() {
  if (!Snake.isControlsOn) Snake.turnOnControls();

  Snake.makeStep();
  if (isGameActive) setTimeout(() => action(), timer.gap)
}

function togglePause() {
  isGameActive = isGameActive === true ? false : true;
  if (isGameActive) action();
}
/*
export function reset() {
  if (stats.isNewRecord) stats.updateRecord();
  stats.resetScore();

  Snake.emptyOut();

  soundLibrary.bgMusic.play();
}

function action() {   
  if (!Snake.isControlsOn) Snake.turnOnControls();

  Snake.makeStep();
  is (Snake.isAlive) {
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
    if (isGameActive) setTimeout(() => action(), timer.gap);
  }
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
*/














