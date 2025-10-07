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

export { normalize, getRandomInt, wait };


