const time = { unit: 500, gap: 500 };
const interval = { id: null };
const states = { gameActive: false, controlsActive: false }

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



export { time, interval, states, stats, shrinkCounter };