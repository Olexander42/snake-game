import { getRandomInt } from "./utils.js";


export default class Color { 
  static getRandomColor({ rangeH = [0, 360], rangeS = [0, 100], rangeL = [0, 100] } = {}) {
    const [h, s, l] = [
      getRandomInt(rangeH[0], rangeH[1]),
      getRandomInt(rangeS[0], rangeS[1]),
      getRandomInt(rangeL[0], rangeL[1]),
    ]

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  static getColorComponents(color) { 
    const hslValues = color.match(/\d+/g).map(Number);
    const hslComponents = {h: hslValues[0], s: hslValues[1], l: hslValues[2]};

    return hslComponents;
  }

  constructor(color='hsl(0, 0%, 0%)') { 
    this.string = color;
    this.hslComponents = Color.getColorComponents(this.string);
  }

  changeColor({ changeH = 0, changeS = 0, changeL = 0 } = {}) {
    const h = Math.min(this.hslComponents.h + changeH, 360);
    const s = Math.min(this.hslComponents.s + changeS, 100);
    const l = Math.min(this.hslComponents.l + changeL, 100);

    const newColor = `hsl(${h}, ${s}%, ${l}%)`

    return newColor;
  }
}

