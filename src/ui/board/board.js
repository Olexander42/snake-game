import { buttons } from '../menu/elements.js';

import { normalize } from '../../common/utils.js';

const backgroundEl = document.querySelector(".background");
const containerEl = document.querySelector(".container");
const borderEl = document.querySelector(".border");

class Board {
  constructor() {
    this.thickness = Math.floor(buttons.size.value / 2) * 2 ;
    this.clip = this.thickness;
    this.step = this.thickness / 2;
    
    this.container = { 
      width: normalize(containerEl.clientWidth, this.step),
      height: normalize(containerEl.clientHeight, this.step), 
    };

    this.container.center = {
      x: normalize(Math.round(this.container.width / 2), this.step),
      y: normalize(Math.round(this.container.height / 2), this.step),
    }
    this.border = { width: this.container.width, height: this.container.height };

    // apply normalized dimensions
    containerEl.style.width = this.container.width + "px";
    containerEl.style.height = this.container.height + "px";
  }

  shrink() {
      this.border.width = borderEl.clientWidth - this.thickness;
      this.border.height = borderEl.clientHeight - this.thickness;
      boardEl.style.width = this.board.width + "px";
      boardEl.style.height = this.board.height + "px";

      this.sizes.clip += this.sizes.step;
      backgroundEl.style.clipPath = `inset(${this.clip - 1}px)`;
    }
}


const board = new Board();

export { board }




