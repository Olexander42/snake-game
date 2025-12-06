import { TIME_UNIT } from "../common/constants.js";
import { speed as snakeSpeed } from "../components/snake/snake.js";
import { root } from "../common/elements.js";


export const timer = (() => {
  let gap = TIME_UNIT;

  return {
    get gap() { return gap },

    updateGap() {
      gap = Math.round(TIME_UNIT / snakeSpeed);
      root.style.setProperty("--time-gap", `${gap / 1000}s`);
    }, 

    reset() { 
      gap = TIME_UNIT;
      root.style.setProperty("--time-gap", `${gap / 1000}s`);
    },
  }
})();


export const stats = (() => {
  const scoreEl =  document.getElementById("score");
  const recordEl = document.getElementById("record");

  let scoreVal = 0;
  let recordVal = 0;

  return {
    get isNewRecord() { scoreVal > recordVal },

    incrementScore() { 
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


export const shrinkCounter = (() => { 
  let outer = 1;
  let inner = 0;

  return {
    get isTimeToShrink() { inner >= outer },

    incrementOuter() {
      inner = 0;
      outer++;
    },

    reset() {
      outer = 1;
      inner = 0; 
    },
  }
})();