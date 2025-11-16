import { TIME_UNIT } from "../common/variables.js";
import { root } from "../common/elements.js";


class Game {
  constructor(board, snake, food) {
    this.board = board;
    this.snake = snake;
    this.food = food;
  
    this.stats = new Stats();
    this.timer = new Timer();
    this.shrinkCounter = new ShrinkCounter();

    this.states = { 
      gameActive: true,
      controlsOn: false, 
    }
  }

  begin() {
    //
  }

  reset() {
    if (this.stats.isNewRecord()) this.stats.updateRecord();
    this.stats.resetScore();
    //
  }
}


class Stats {
  #scoreEl;
  #recordEl;
  #scoreVal;
  #recordVal;

  constructor() {
    this.#scoreEl =  document.getElementById("score");
    this.#recordEl = document.getElementById("record");

    this.#scoreVal = 0;
    this.#recordVal = 0;
  }

  isNewRecord() {
    return this.#scoreVal > this.#recordVal;
  }

  incrementScore() { 
    this.#scoreVal++;
    this.#scoreEl.innerText = `Score:${this.#scoreVal}`; 
  }

  updateRecord() { 
    this.#recordVal = this.#scoreVal;
    this.#recordEl.innerText = `Record:${this.#recordVal}`;
  }

  resetScore() { 
    this.#scoreVal = 0; 
    this.#scoreEl.innerText = `Score:${this.#scoreVal}`;
  }
}

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

class ShrinkCounter { 
  #outer;
  #inner;

  constructor() {
    this.#outer = 1;
    this.#inner = 0;
  }

  isTimeToShrink() {
    this._incrementInner();

    if (this.#inner < this.#outer) return false; 
    else {
      this.#inner = 0;
      this.#outer++;

      return true;
    }
  }

  _incrementOuter() { 
    this.#outer++;
    this.#inner = 0;
  }
  
  _incrementInner() { 
    this.#inner++;
  }

  reset() {
    this.#outer = 1;
    this.#inner = 0; 
  }
}

export default Game;


