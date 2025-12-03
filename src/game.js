import * as Board from "./components/board.js";
import * as Snake from "./components/snake.js";
//import * as Food from "./components/Food.js";
const Food = null; // mock

import { TIME_UNIT } from "./src/common/constants.js";
import { root, html, sizeInput, menu } from "./src/common/elements.js";
import { sleep } from "./src/common/utils.js";
import { soundLibrary } from "./src/common/sound.js";


isActive = false;

const timer = (() => {
  let gap = TIME_UNIT;

  return {
    updateGap: () => {
      gap = Math.round(TIME_UNIT / Snake.speed);
      root.style.setProperty("--time-gap", `${gap / 1000}s`);
    } 

    reset() { 
      gap = TIME_UNIT;
      root.style.setProperty("--time-gap", `${gap / 1000}s`);
    }
  }
})();

const stats = (() => {
  const scoreEl =  document.getElementById("score");
  const recordEl = document.getElementById("record");

  let scoreVal = 0;
  let recordVal = 0;

  return {
    isNewRecord: () => scoreVal > recordVal,

    incrementScore: () => { 
      scoreVal++;
      scoreEl.innerText = `Score:${scoreVal}`; 
    },

    updateRecord() { 
      recordVal = scoreVal;
      recordEl.innerText = `Record:${recordVal}`;
    },

    resetScore() {
      scoreVal = 0; 
      scoreEl.innerText = `Score:${scoreVal}`;
    },
  }
})();

const shrinkCounter = (() => { 
  let outer = 1;
  let inner = 0;

  return {
    isTimeToShrink: () => inner >= outer,

    incrementOuter: () => {
      inner = 0;
      outer++;
    },

    reset: () => {
      outer = 1;
      inner = 0; 
    },
  }
})();
  

export function attachControls() {
  html.addEventListener('keydown', (event) => {
    if (event.code === 'Space') togglePause();
    else if (event.code.slice(0, 5) === 'Arrow' && Snake.controlsOn) { 
      Snake.handleControls(event.code); 
    } 
  })
}

export function begin() {
  
  
  Board.normalize(sizeInput.value);

  Snake.spawn(Board.data, snakeColor);

  Food.teleport(Board.data, Snake.bodyData);
  Food.fadeIn();
  Food.transitionColors();

  timer.updateGap();
  action();
}

export function reset() {
  Snake.div.replaceChildren()

  if (stats.isNewRecord()) stats.updateRecord();
  stats.resetScore();

  soundLibrary.bgMusic.play();
}

function action() {   
  if (!Snake.controlsOn) Snake.controlsOn = true;

  Snake.makeStep();
  if (!Snake.isAlive) {
    gameOver();
    return;
  }

  if (Snake.isAteFood(Food.coords)) {
    soundLibrary.bite.play();
    shrinkCounter.inner++;

    if (shrinkCounter.isTimeToShrink() && !Snake.isNearOppositeBorders()) {
      Board.shrink();
      Snake.offsetShrink(Board.data);

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
    Snake.controlsOn = true;

    action(timer.gap);
  } else {
    isActive = false;
    Snake.controlsOn = false;
  }
}

function gameOver() {
  soundLibrary.bgMusic.pause();
  soundLibrary.gameOver.play();
  
  Snake.controlsOn = false;
  
  Snake.greyout(TIME_UNIT);

  setTimeout(() => menu.style.display = 'flex', TIME_UNIT);
}








