import { menuButtons } from '../../controls/elements.js';

import { normalize } from '../../common/utils.js';

class Board {
  constructor() {
    this.thick = Math.floor(40 / 2) * 2 ; // replace "40" with menuButtons.size.value
    this.clip = this.thick;
    this.step = this.thick / 2;

    this.containerEl = document.querySelector(".container");
    this.backgroundEl = document.querySelector(".background");
    this.borderEl = document.querySelector(".border");

    this.container = { 
      width: normalize(this.containerEl.clientWidth, this.step),
      height: normalize(this.containerEl.clientHeight, this.step), 
    };

    this.background = { width: this.container.width, height: this.container.height };
    this.border = { width: this.container.width, height: this.container.height };

    this.container.center = {
      x: normalize(Math.round(this.container.width / 2), this.step),
      y: normalize(Math.round(this.container.height / 2), this.step),
    }
    
    this._applyNewDimensions("container");
    this._applyNewDimensions("background");
    this._applyNewDimensions("border");
  }

  shrink() {
    this.border.width = this.borderEl.clientWidth - this.thick;
    this.border.height = this.borderEl.clientHeight - this.thick;
    this._applyNewDimensions("border");

    this.sizes.clip += this.sizes.step;
    this.backgroundEl.style.clipPath = `inset(${this.clip - 1}px)`;
  }

  _applyNewDimensions(name) {
    this[`${name}El`].style.width = this[`${name}`].width + "px";
    this[`${name}El`].style.height = this[`${name}`].height + "px";
  }
}

const board = new Board();

export { board };




