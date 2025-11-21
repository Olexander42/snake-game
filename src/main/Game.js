import { TIME_UNIT } from "../common/constants.js";
import { root, html, startBtn } from "../common/elements.js";


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
    const bounds = this.board.getBounds();
    const snakeColor = document.querySelector('input[name="color"]:checked').value;
    this.snake.spawn(bounds, snakeColor);
    /*
    food.generateRandomCoords(snake.bodyData);
    food.teleport();
    food.fadeIn();
    */
    this._windup();
  }

  _windup() {
    const initTimer = (timestamp, callback) => {
      let start = timestamp;

      callback(timestamp, start);
    }

    const nextTick = (timestamp, start) => {
      const timeElapsed = timestamp - start;
    
      if (timeElapsed >= this.timer.gap) { // time to make step   
        if (!this.snake.controlsOn) this.snake.controlsOn = true;
        this._action();      

        initTimer(timestamp, nextTick);
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

  _action() {
    this.snake.makeStep();
    if (!this.snake.alive) this._gameOver()
  }

  _gameOver() {
    cancelAnimationFrame(this.rafId);
    startBtn.style.display = 'flex';
  }

  reset() {
    if (this.stats.isNewRecord()) this.stats.updateRecord();
    this.stats.resetScore();
    // to be continued
  }

  attachControls() {
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
    this._updateCssVar();
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

    // reset score
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


