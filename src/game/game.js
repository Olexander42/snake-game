import { TIME_UNIT } from "../common/constants.js";
import { root, html, menu } from "../common/elements.js";
import { soundLibrary, isMuted, toggleMute } from "../common/sound.js";

import * as Board from "../components/board.js";
import * as Snake from "../components/snake/API.js";
import * as Food from "../components/food.js"; 

import { timer, stats, shrinkCounter } from "./managers.js";

export let isFirstStart = true;
export let isGameActive = false;

export function begin() { 
  Board.normalize();
  const borders = Board.getBorders();

  Snake.spawn(Board.center);
 
  Snake.setBorders(borders);
  const snakeCoords =  Snake.getBodyData();

  if (isFirstStart) {  
    Food.init(borders, snakeCoords);
    Food.transitionColors();
    
    stats.initElements(); 
    isFirstStart = false;
  }
  
  Food.teleport(borders, snakeCoords);
  Food.fadeIn();

  timer.updateGap(Snake.speed);
  setTimeout(() => action(), timer.gap);

  isGameActive = true;
}

export function attachControls() {
  const whitelist = ['ControlLeft', 'Shift', 'KeyR'];
  
  html.addEventListener('keydown', (event) => {
    if (!whitelist.includes(event.code)) event.preventDefault();
    if (event.code === 'Space') togglePause();
    else if (isGameActive) Snake.handleKeydown(event.code);
  })
}

export function reset() {
  if (stats.isNewRecord) stats.updateRecord();
  stats.resetScore();
  shrinkCounter.reset();

  Snake.emptyOut();

  if (!isMuted) soundLibrary.bgMusic.play();
}

function action() {   
  if (!Snake.isControlsOn) Snake.turnOnControls();

  Snake.makeStep();
  if (!Snake.isAlive) gameOver();

  else if (Snake.isAteFood(Food.getCoords())) {
    soundLibrary.bite.play();
    handleShrink();
    levelUp();
  }

  if (isGameActive) setTimeout(() => action(), timer.gap);
}

function togglePause() {
  isGameActive = isGameActive === true ? false : true;
  if (isGameActive) action();
}

function levelUp() {
  Snake.grow();
  Snake.speedUp();
  timer.updateGap(Snake.speed);

  Food.teleport(Board.getBorders(), Snake.getBodyData());

  stats.incrementScore();
}

function handleShrink() {
  shrinkCounter.incrementInner();
  const isAllowShrink = shrinkCounter.isTimeToShrink && !Snake.isNearOppositeBorders();
  if (isAllowShrink) {
    Board.shrink(); 
    Snake.offsetShrink(Board.getBorders());

    shrinkCounter.incrementOuter();
  }
}

function gameOver() {
  if (!isMuted) {
    soundLibrary.bgMusic.pause();
    soundLibrary.gameOver.play();
  }

  Snake.greyoutBody(TIME_UNIT);
  setTimeout(() => menu.style.display = 'flex', TIME_UNIT);

  isGameActive = false;
}















