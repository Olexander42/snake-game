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
  