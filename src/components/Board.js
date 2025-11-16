import { normalize } from "../common/utils.js";
import { root } from "../common/elements.js";

class Board {
  #bounds;
  #center;

  constructor(size_step) {
    this.container = document.getElementById("container");
    this.background = document.getElementById("background");
    this.border = document.getElementById("border");

    this._updateSizeUnits(size_step);
    this.init(size_step);
    this._calcCenter();
  }

  init(size_step) {
    this._updateSizeUnits(size_step);

    root.style.setProperty("--size", `${this.borderThick}px`);
    root.style.setProperty("--clip", `${this.bgClip}px`);

    // calc 
    this.#bounds = {
      width: normalize(this.container.clientWidth, this.borderThick),
      height: normalize(this.container.clientHeight, this.borderThick),
    };
  
    // apply 
    [this.container, this.background, this.border,].forEach(element => {
      element.style.width = this.#bounds.width + 'px';
      element.style.height = this.#bounds.height + 'px';
    })
  }
  
  shrink() {
    this.#bounds.width -= this.borderThick;
    this.#bounds.height -= this.borderThick;

    this.border.style.width = this.#bounds.width + 'px';
    this.border.style.height = this.#bounds.height + 'px';

    this._updateBackgroundClip();
  }

  _updateBackgroundClip() {
    this.bgClip += this.borderThick / 2;
    root.style.setProperty("--clip", `${this.bgClip}px`);
  }

  _updateSizeUnits(size_step) {
    this.borderThick = size_step;
    this.bgClip = size_step / 2;
  }

  _calcCenter() {
    this.#center = {
      x: normalize(Math.round(this.#bounds.width) / 2, this.borderThick),
      y: normalize(Math.round(this.#bounds.height) / 2, this.borderThick)
    }
  }

  getBounds() {
    return this.#bounds;
  }

  getCenter() {
    return this.#center;
  }
}


export default Board;










