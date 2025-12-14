import { TIME_UNIT } from "../common/constants.js";
import { root } from "../common/elements.js";


export const timer = (() => {
  let gap = TIME_UNIT;

  return {
    get gap() { return gap },

    updateGap: (speed) => {
      gap = Math.round(TIME_UNIT / speed);
      root.style.setProperty("--time-gap", `${gap / 1000}s`);
    }, 

    reset: () => { 
      gap = TIME_UNIT;
      root.style.setProperty("--time-gap", `${gap / 1000}s`);
    },
  }
})();


export const stats = (() => {
  let scoreEl, recordEl;

  let scoreVal = 0;
  let recordVal = 0;

  return {
    get isNewRecord() { return scoreVal > recordVal },

    incrementScore: () => { 
      scoreVal++;
      scoreEl.innerText = `Score:${scoreVal}`; 
    },

    updateRecord: () => { 
      recordVal = scoreVal;
      recordEl.innerText = `Record:${recordVal}`;
    },

    resetScore: () => {
      scoreVal = 0; 
      scoreEl.innerText = `Score:${scoreVal}`;
    },

    initElements: () => {
      scoreEl =  document.getElementById("score");
      recordEl = document.getElementById("record");
    }
  }
})();


export const shrinkCounter = (() => { 
  let outer = 1;
  let inner = 0;

  return {
    get isTimeToShrink() { return inner >= outer },

    incrementInner: () => inner++,
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