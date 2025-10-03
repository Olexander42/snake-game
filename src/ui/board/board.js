import { buttons } from '../../controls/elements.js';

import { normalize } from '../../common/utils.js';

class Board {
  constructor() {
    this.backgroundEl = document.querySelector(".background");
    this.containerEl = document.querySelector(".container");
    this.borderEl = document.querySelector(".border");
    this.thick = Math.floor(buttons.size.value / 2) * 2 ;
    this.clip = this.thick;
    this.step = this.thick / 2;
    
    this.container = { 
      width: normalize(this.containerEl.clientWidth, this.step),
      height: normalize(this.containerEl.clientHeight, this.step), 
    };

    this.container.center = {
      x: normalize(Math.round(this.container.width / 2), this.step),
      y: normalize(Math.round(this.container.height / 2), this.step),
    }
    this.border = { width: this.container.width, height: this.container.height };

    // apply normalized dimensions
    this.containerEl.style.width = this.container.width + "px";
    this.containerEl.style.height = this.container.height + "px";
  }

  shrink() {
      this.border.width = borderEl.clientWidth - this.thick;
      this.border.height = borderEl.clientHeight - this.thick;
      this.boardEl.style.width = this.board.width + "px";
      this.boardEl.style.height = this.board.height + "px";

      this.sizes.clip += this.sizes.step;
      this.backgroundEl.style.clipPath = `inset(${this.clip - 1}px)`;
    }
}

const board = new Board();

export { board };




