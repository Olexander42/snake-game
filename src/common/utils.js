function normalize(value, denominator) {
  return (Math.floor(value / denominator) * denominator);
}

function getRandomInt(min, max) { // max excluded
  const result = Math.floor(Math.random() * ((max - min)) + min); 
  return result;
}

export { normalize, getRandomInt };


