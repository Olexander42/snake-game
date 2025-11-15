import { TIME_UNIT } from "../common/variables.js";


class Game {
  constructor(Board, Snake, Food) {
    this.board = new Board();
    this.snake = new Snake();
    this.food = new Food();

    this.states = { 
      gameActive: false,
      controlsOn: false, 
    }

    this.time = { 
      gap: TIME_UNIT,

      updateGap(speed=this.snake.speed) {
        this.gap = Math.round(TIME_UNIT / speed);
        root.style.setProperty("--time-gap", `${this.gap / 1000}s`);
      },

      reset() { 
        this.gap = TIME_UNIT;
        root.style.setProperty("--time-gap", `${this.gap / 1000}s`);
      },
    }
  }

  windup() {
    const initTimer = (timestamp, f) => {
      let start = timestamp;
      f(timestamp, start);
    }

    const nextStep = (timestamp, start) => {
      const timeElapsed = timestamp - start;
      if (timeElapsed >= time.gap) { // time for a move
        // update states
        if (!states.gameActive) states.gameActive = true;
        if (!states.controlsOn) {
          html.addEventListener('keydown', snakeControl);
          states.controlsOn = true;
        }

        action();    
        if (raf.id !== "game over") initTimer(t, nextStep); // restart the countdown to the next move
      } else {
        raf.id = requestAnimationFrame((t) => nextStep(t, start)); 
      }
    }

    const nextColor = (t, start) => {
      const timeElapsed = t - start;

      if (timeElapsed >= TIME_UNIT * 2) {
        food.changeColor();
        initTimer(t, nextColor); // restart the countdown to the next color change
      } else {
        requestAnimationFrame((t) => nextColor(t, start));
      }
    }

    requestAnimationFrame((timestamp) => {
      initTimer(timestamp, nextColor);
      initTimer(timestamp, nextStep);
    });
  }
}