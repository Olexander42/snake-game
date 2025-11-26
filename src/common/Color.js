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
    const h = Math.min(this.hslComponents.h + changeH, 360);
    const s = Math.min(this.hslComponents.s + changeS, 100);
    const l = Math.min(this.hslComponents.l + changeL, 100);

    const newColor = `hsl(${h}, ${s}%, ${l}%)`

    return newColor;
  }
}

export default Color;