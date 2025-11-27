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

export function getRandomColor({ rangeH = [0, 360], rangeS = [0, 100], rangeL = [0, 100] } = {}) {
  const [h, s, l] = [
    getRandomInt(rangeH[0], rangeH[1]),
    getRandomInt(rangeS[0], rangeS[1]),
    getRandomInt(rangeL[0], rangeL[1]),
  ]

  return `hsl(${h}, ${s}%, ${l}%)`;
}




