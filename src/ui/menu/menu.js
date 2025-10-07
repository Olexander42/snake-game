import { board } from "../../components/board.js";

class Slider {
  constructor() {
    this.range = document.getElementById("size");
    this.oldValue = this.range.value;
  }

  thumbTransition() {
    this.targetValue = this.range.value;
    this.range.value = this.oldValue;
    this.range.step = 1;

    this.interval = setInterval(() => {
      this.range.value > this.targetValue ? this.range.value-- : this.range.value++;

      board.thick = parseInt(this.range.value); 
      board.init();

      this._updateGradient();
      
      if (this.range.value === this.targetValue) {
        clearInterval(this.interval);

        this.range.step = 10;
        this.oldValue = this.range.value;

        board.normalize();       
      }
    }, 4)
  }

  _updateGradient() {
    this.gradientCutoffVal = (this.range.value - this.range.min) / (this.range.max - this.range.min) * 100;
    this.gradient = `linear-gradient(to right, black, black ${this.gradientCutoffVal}%, transparent ${this.gradientCutoffVal}%, transparent)`;
    this.range.style.setProperty("--responsive-gradient", this.gradient);
  }
}

const slider = new Slider();

export { slider };

