import { normalize, calcCenter } from "../../common/utils.js";
import { root, background, border, container } from "../../common/elements.js";

class Board {
  #updateSizeUnits(size_step) {
    this.sizeStep = size_step;
    this.bgClip = size_step / 2;
  }

  constructor(size_step) {
    this.#updateSizeUnits(size_step);
    this.resize(size_step);

    this.shrinkCounter = ( () => { 
      let outer = 1;
      let inner = 0;

      return {
        addOuter: () => { outer++ },
        addInner: () => { inner++ },
        reset: () => {
          outer = 1;
          inner = 0; 
        },
      }
    })(); 
  }

  resize(size_step) {
    this.#updateSizeUnits(size_step);

    root.style.setProperty("--size", `${this.sizeStep}px`);
    root.style.setProperty("--clip", `${this.bgClip}px`);

    // calc normalized dimenisons
    this.normalizedDimensions = { 
      width: normalize(container.clientWidth, this.sizeStep),
      height: normalize(container.clientHeight, this.sizeStep), 
    };

    // apply normalized dimensions
    [background, border, container].forEach(element => {
      element.style.width = this.normalizedDimensions.width + 'px';
      element.style.height = this.normalizedDimensions.height + 'px';
    })
  }


  shrink() {
    const newBorderWidth = border.clientWidth - this.sizeStep;
    const newBorderHeght = border.clientHeight - this.sizeStep;

    border.style.width = newBorderWidth + 'px';
    border.style.height = newBorderHeght + 'px';

    this.bgClip += this.sizeStep / 2;
    root.style.setProperty("--clip", `${this.bgClip}px`);
  }
}


export default Board;










