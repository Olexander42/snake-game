import { snake } from "../components/snake/snake.js";
import { root } from "./elements.js";


const timeUnit = 1000; 

const time = { 
  gap: timeUnit,

  updateGap() {
    this.gap = Math.round(timeUnit / snake.speed);
    root.style.setProperty("--time-gap", `${this.gap / 1000}s`);
  },

  reset() { 
    this.gap = timeUnit;
  },
}

const raf = { id: undefined };

const states = { 
  gameActive: false,
  controlsOn: false, 
}

const stats = { 
  score: {
    element: document.querySelector(".score"),
    value: 0,
  },

  record: {
    element: document.querySelector(".record"),
    value: 0,
  }
}

const shrinkCounter = { 
  outer: 1,
  inner: 0,

  reset() {
    this.outer = 1;
    this.inner = 0; 
  } 
}


export { time, raf, states, stats, shrinkCounter };