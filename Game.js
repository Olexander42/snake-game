import { TIME_UNIT, MS_PER_SECOND } from "./src/common/constants.js";
import getElement from "./src/common/elements.js";
import { sleep } from "./src/common/utils.js";


class Game {
  constructor(board, snake, food) {
    this.board = board;
    this.snake = snake;
    this.food = food;
  
    this.stats = new Stats();
    this.timer = new Timer();
    this.shrinkCounter = new ShrinkCounter();

    this.rafId = null;
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
    this._windupSnake(this.timer.gap);

    // food 
    this.food.teleport(this.board.data, this.snake.bodyData);
    this.food.fadeIn();
    this.food.transitionColors();
  }

  _windup() {
    const initTimer = (timestamp, callback) => {
      let start = timestamp;

      callback(timestamp, start);
    }

    const nextTick = (timestamp, start) => {
      const timeElapsed = timestamp - start;
      if (timeElapsed >= this.timer.gap) { // time to make step   
        

        this._action();      
        if (this.snake.alive) initTimer(timestamp, nextTick);
        else this._gameOver();

      } else {
        this.rafId = requestAnimationFrame((timestamp) => nextTick(timestamp, start)); 
      }
    }

    /*
    const nextColor = (t, start) => {
      const timeElapsed = t - start;

      if (timeElapsed >= TIME_UNIT * 2) {
        food.changeColor();
        initTimer(t, nextColor); // restart the countdown to the next color change
      } else {
        requestAnimationFrame((t) => nextColor(t, start));
      }
    }
    */

    requestAnimationFrame((timestamp) => {
      //initTimer(timestamp, nextColor);
      initTimer(timestamp, nextTick);
    });
  }

  async _windupSnake(ms) {
    await sleep(ms);
    if (!this.snake.controlsOn) this.snake.controlsOn = true;
    this._action();
  } 


  async _windupFoodColorChange(ms) {
    await sleep(ms);

    this.food.transitionColor();
    this._windupFoodColorChange(ms);
  } 

  _action() {
    this.snake.makeStep();

    if (!this.snake.isAlive) {
      this._gameOver();
      return;
    }

    if (this.snake.isAteFood(this.food.coords)) {
      if (this.shrinkCounter.isTimeToShrink()) {
        this.board.shrink();
        this.snake.updateBoardData(this.board.data);
      }

      this.stats.incrementScore();

      this.food.teleport(this.board.data, this.snake.bodyData);

      this.snake.grow();
      this.snake.speedUp();
      this.timer.updateGap(this.snake.speed);
    }

    this._windupSnake(this.timer.gap);
  }

  async _gameOver() {
    const startBtn = getElement.startBtn();
    this.snake.controlsOn = false;

    await sleep(1000);
    startBtn.style.display = 'flex';
  }

  reset() {
    // components
    this.snake.div.replaceChildren(); // delete

    // stats
    if (this.stats.isNewRecord()) this.stats.updateRecord();
    this.stats.resetScore();


  /*  
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
  */
  }

  attachControls() {
    const html = getElement.html();

    html.addEventListener('keydown', (event) => { 
      const buttonPressed = event.code;
  
      if (buttonPressed === 'Space') this._togglePause();
      else if (buttonPressed.slice(0, 5) === 'Arrow' && this.snake.controlsOn) { this.snake.handleControls(buttonPressed) } 
    })
  }

  _togglePause() {
    if (this.isPaused) {
      this.isPaused = false;
      this.snake.controlsOn = true;

      this._windup();
    } else {
      cancelAnimationFrame(this.rafId);
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
    this.inner++;

    if (this.inner < this.outer) return false; 
    else {
      this.inner = 0;
      this.outer++;

      return true;
    }
  }

  reset() {
    this.outer = 1;
    this.inner = 0; 
  }
}

export default Game;


