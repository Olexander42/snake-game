import { sizeSlider } from "../menu/elements.js";

import { root } from "../../common/elements.js";

import { normalize } from '../../common/utils.js';

class Board {
  constructor() {
    this.thick = parseInt(sizeSlider.value);

    this.containerEl = document.querySelector(".container");
    this.backgroundEl = document.querySelector(".background");
    this.borderEl = document.querySelector(".border");

    this.init();
    this.normalize();
  }

  init() {
    this.clip = this.thick;
    this.step = this.thick / 2;

    this._setSizeProperty();
  }

  normalize() {
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

    this.clip += this.step;
    this.backgroundEl.style.clipPath = `inset(${this.clip - 1}px)`;
  }

  _applyNewDimensions(name) {
    this[`${name}El`].style.width = this[`${name}`].width + "px";
    this[`${name}El`].style.height = this[`${name}`].height + "px";
  }

  _setSizeProperty() {
    root.style.setProperty("--size", `${this.thick}px`);
  }
}

const board = new Board();

export { board };




