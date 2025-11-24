import { getRandomInt } from "./utils.js";


class Color { 
  // only works with hsl
  constructor(color='hsl(0, 0%, 0%)') { 
    this.string = color;
    this.hslComponents = this._colorComponents();
  }

  _colorComponents() { 
    const hslValues = this.string.match(/\d+/g).map(Number);
    const hslComponents = {h: hslValues[0], s: hslValues[1], l: hslValues[2]};

    return hslComponents;
  }

  changeColor({ changeH = 0, changeS = 0, changeL = 0 } = {}) {
    const h = this.hslComponents.h + changeH;
    const s = this.hslComponents.s + changeS;
    const l = this.hslComponents.l + changeL;

    const newColor = `hsl(${h}, ${s}%, ${l}%)`

    return newColor;
  }

  getRandomColor({ rangeH = [0, 360], rangeS = [0, 100], rangeL = [0, 100] } = {}) {
    const randomColor = this.changeColor(
      { 
        changeH: getRandomInt(rangeH[0], rangeH[1]),
        changeS: getRandomInt(rangeS[0], rangeS[1]),
        changeL: getRandomInt(rangeL[0], rangeL[1]),
      }
    )

    return randomColor;
  }
}

export default Color;