export const roundTo = (value, decimals) => Math.round(value * (10 ** decimals)) / (10 ** decimals);
export const normalize = (value, denominator) => Math.round(value / denominator) * denominator;
export const getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min)) + min); // max excluded
export const deepCopy = (obj) => obj.map(p => ({ ...p}));







