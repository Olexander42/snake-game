export function normalize(value, denominator) {
  return Math.round(value / denominator) * denominator;
}

export function getRandomInt(min, max) { // max excluded
  return (Math.floor(Math.random() * ((max - min)) + min));
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms);
  })
}

export function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}





