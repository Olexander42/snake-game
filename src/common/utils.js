function normalize(value, denominator) {
  return (Math.round(value / denominator) * denominator);
}

function getRandomInt(min, max) { // max excluded
  const result = Math.floor(Math.random() * ((max - min)) + min); 
  return result;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms);
  })
}

function splitColor(color) {
  const hsl = color.match(/\d+/g).map(Number);
  return {h: hsl[0], s: hsl[1], l: hsl[2]};
}

function changedColor(hsl, {h = 0, s = 0, l = 0} = {}) {
    return `hsl(${hsl.h + h}, ${hsl.s + s}%, ${hsl.l + l}%)`
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}


export { normalize, getRandomInt, wait, splitColor, changedColor, roundTo };


