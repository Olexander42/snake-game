import { TIME_UNIT } from "./src/common/constants.js";
import getElement from "./src/common/getElement.js";
import { sleep } from "./src/common/utils.js";
import { soundLibrary } from "./src/common/sound.js";

export default class Game {
  constructor(board, snake, food) {
    this.board = board;
    this.snake = snake;
    this.food = food;
  
    this.stats = new Stats();
    this.timer = new Timer();
    this.shrinkCounter = new ShrinkCounter();

    this.isPaused = false;
  }

  begin() {
    // board
    const sizeInput = getElement.sizeInput();
    this.board.normalize(sizeInput.value);

    // snake
    const snakeColor = document.querySelector('input[name="color"]:checked').value;
    this.snake.spawn(this.board.data, snakeColor);
    this.timer.updateGap(this.snake.speed);

    // food 
    this.food.teleport(this.board.data, this.snake.bodyData);
    this.food.fadeIn();
    this.food.transitionColors();

    this._action();
  }

  _action() {   
    if (!this.snake.controlsOn) this.snake.controlsOn = true;

    this.snake.makeStep();
    if (!this.snake.isAlive) {
      this._gameOver();
      return;
    }
 
    if (this.snake.isAteFood(this.food.coords)) {
      soundLibrary.bite.play();
      this.shrinkCounter.inner++;

      if (this.shrinkCounter.isTimeToShrink() && !this.snake.isNearOppositeBorders()) {
        this.board.shrink();
        this.snake.offsetShrink(this.board.data);

        this.shrinkCounter.incrementOuter();
      }

      this.stats.incrementScore();

      this.food.teleport(this.board.data, this.snake.bodyData);

      this.snake.grow();
      this.snake.speedUp();

      this.timer.updateGap(this.snake.speed);
    }

    if (!this.isPaused) setTimeout(() => this._action(), this.timer.gap);
  }

  async _gameOver() {
    soundLibrary.bgMusic.pause();
    soundLibrary.gameOver.play();
    
    this.snake.controlsOn = false;
    
    this.snake.greyout(TIME_UNIT);

    await sleep(TIME_UNIT);
    getElement.startBtn().style.display = 'flex';
  }

  reset() {
    this.snake.div.replaceChildren(); // delete snake

    if (this.stats.isNewRecord()) this.stats.updateRecord();
    this.stats.resetScore();

    soundLibrary.bgMusic.play();
  }

  attachControls() {
    getElement.html().addEventListener('keydown', (event) => { 
      if (event.code === 'Space') this._togglePause();
      else if (event.code.slice(0, 5) === 'Arrow' && this.snake.controlsOn) { 
        this.snake.handleControls(event.code); 
      } 
    })
  }

  _togglePause() {
    if (this.isPaused) {
      this.isPaused = false;
      this.snake.controlsOn = true;

      this._action(this.timer.gap);
    } else {
      this.isPaused = true;
      this.snake.controlsOn = false;
    }
  }
}

// helpers
class Timer {
  constructor() {
    this.gap = TIME_UNIT;
  }

  updateGap(speed) {
    this.gap = Math.round(TIME_UNIT / speed);
    this._updateCssVar();
  } 

  reset() { 
    this.gap = TIME_UNIT;
    this._updateCssVar();
  }

  _updateCssVar() {
    const root = getElement.root();
    root.style.setProperty("--time-gap", `${this.gap / 1000}s`);
  }
}

class Stats {
  constructor() {
    this.scoreEl =  document.getElementById("score");
    this.recordEl = document.getElementById("record");

    this.scoreVal = 0;
    this.recordVal = 0;
  }

  isNewRecord() {
    return this.scoreVal > this.recordVal;
  }

  incrementScore() { 
    this.scoreVal++;
    this.scoreEl.innerText = `Score:${this.scoreVal}`; 
  }

  updateRecord() { 
    this.recordVal = this.scoreVal;
    this.recordEl.innerText = `Record:${this.recordVal}`;
  }

  resetScore() {
    this.scoreVal = 0; 
    this.scoreEl.innerText = `Score:${this.scoreVal}`;
  }
}

class ShrinkCounter { 
   constructor() {
    this.outer = 1;
    this.inner = 0;
  }

  isTimeToShrink() {
    return this.inner >= this.outer
  }

  incrementOuter() {
    this.inner = 0;
    this.outer++;
  }

  reset() {
    this.outer = 1;
    this.inner = 0; 
  }
}


