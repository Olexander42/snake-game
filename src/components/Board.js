import { normalize } from "../common/utils.js";
import getElement from "../common/getElement.js";


export default class Board {
  constructor() {
    this.container = getElement.container();
    this.background = getElement.background();
    this.border = getElement.border();
    
    this.root = getElement.root();
  }

  normalize(size_step) {
    // update units
    this.borderThick = Number(size_step);
    this.bgClip = this.borderThick;

    this.root.style.setProperty("--size", `${this.borderThick}px`);
    this.root.style.setProperty("--clip", `${this.bgClip}px`);

    // calculate
    this.bounds = {
      width: normalize(this.container.clientWidth, this.borderThick),
      height: normalize(this.container.clientHeight, this.borderThick),
    };
  
    // apply 
    [this.container, this.background, this.border,].forEach(element => {
      element.style.width = `${this.bounds.width}px`;
      element.style.height = `${this.bounds.height}px`;
    })

    this.center = {
      x: normalize(Math.round(this.bounds.width) / 2, this.borderThick),
      y: normalize(Math.round(this.bounds.height) / 2, this.borderThick),
    }

    this._updateData();
  }
  
  shrink() {
    // border
    this.bounds.width -= this.borderThick;
    this.bounds.height -= this.borderThick;

    // we don't resize container to avoid snake shift
    this.border.style.width = `${this.bounds.width}px`;
    this.border.style.height =`${this.bounds.height}px`;

    // background
    this.bgClip += this.borderThick / 2;
    this.root.style.setProperty("--clip", `${this.bgClip}px`);

    this._updateData();
  }

  _updateData() {
    this.data = {
      bounds: {
        left: this.bgClip,
        right: this.container.clientWidth - this.bgClip - this.borderThick, // - borderThick to offest distance to head.left
        top: this.bgClip,
        bottom: this.container.clientHeight - this.bgClip - this.borderThick, // - borderThick to offest distance to head.top 
      },
      center: this.center,
      step: this.borderThick / 2,
    }
  }
}











