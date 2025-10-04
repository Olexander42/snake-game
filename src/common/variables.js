const time = { unit: 500, gap: 500 };

const stats = { score: 0, record: 0 };

const shrinkCounter = { 
  outer: 1,
  inner: 0,
  reset() {
    this.outer = 1;
    this.inner = 0; 
  } 
}

const interval = { id: null };

export { time, stats, shrinkCounter, interval };