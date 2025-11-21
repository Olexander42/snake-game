import { normalize } from "../common/utils.js";
import { root, container, background, border } from "../common/elements.js";

class Board {
  constructor() {
    this.container = container;
    this.background = background;
    this.border = border;
  }

  normalize(size_step) {
    // update units
    this.borderThick = Number(size_step);
    this.bgClip = this.borderThick;

    root.style.setProperty("--size", `${this.borderThick}px`);
    root.style.setProperty("--clip", `${this.bgClip}px`);

    // calculate
    this.bounds = {
      width: normalize(this.container.clientWidth, this.borderThick),
      height: normalize(this.container.clientHeight, this.borderThick),
    };
  
    // apply 
    [this.container, this.background, this.border,].forEach(element => {
      element.style.width = this.bounds.width + 'px';
      element.style.height = this.bounds.height + 'px';
    })
  }
  
  shrink() {
    // border
    this.bounds.width -= this.borderThick;
    this.bounds.height -= this.borderThick;

    this.border.style.width = this.bounds.width + 'px';
    this.border.style.height = this.bounds.height + 'px';

    // background
    this.bgClip += this.borderThick / 2;
    root.style.setProperty("--clip", `${this.bgClip}px`);
  }

  getBounds() {
    const calculateCenter = () => {
      const center = {
        x: normalize(Math.round(this.bounds.width) / 2, this.borderThick),
        y: normalize(Math.round(this.bounds.height) / 2, this.borderThick)
      }

      return center
    }

    return {
      left: this.bgClip,
      right: this.bounds.width - this.bgClip - this.borderThick, // - borderThick to offest distance to head.left
      top: this.bgClip,
      bottom: this.bounds.height - this.bgClip - this.borderThick, // - borderThick to offest distance to head.top
      center: calculateCenter(),
      step: this.borderThick / 2,
    }
  }
}


export default Board;










