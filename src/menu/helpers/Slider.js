export default class Slider {
  constructor(input, speed, callbackFn=undefined) {
    this.input = input;
    this.STEP_DEFAULT = this.input.step;
    this.STEP_TRANSITION = speed;
    this.callbackFn = callbackFn;

    this.requiresAdjustment = this.STEP_DEFAULT % this.STEP_TRANSITION !== 0;
    this.currentValue = Number(this.input.value);

    this.input.addEventListener('input', (event) => this.moveThumb(event));
  }

  moveThumb() {
    this.targetValue = Number(this.input.value);
    this.input.value = this.currentValue;
    this.input.step = this.STEP_TRANSITION; 

    requestAnimationFrame(() => this._step());
  }

  _step() {
      this.currentValue += (this.currentValue > this.targetValue) // increase or decrease value?
        ? -this.STEP_TRANSITION 
        : this.STEP_TRANSITION;
      this.input.value = this.currentValue;

      this._updateGradient();

      if (this.currentValue === this.targetValue) { // finished transitioning
        this.input.step = this.STEP_DEFAULT;

        if (this.callbackFn) this.callbackFn(this.input.value);

      } else {
        if (this.requiresAdjustment) {
          const delta = (Math.abs(this.currentValue - this.targetValue));
          if  (delta < this.STEP_TRANSITION) { // time for adjustment
            this.STEP_TRANSITION = delta; // make sure the next currentValue === targetValue
          }
        }

        requestAnimationFrame(() => this._step()); 
      }
    }

  _updateGradient() {
    const gradientCutoffVal = (this.input.value - this.input.min) / (this.input.max - this.input.min) * 100;
    const gradient = `linear-gradient(to right, black, black ${gradientCutoffVal}%, transparent ${gradientCutoffVal}%, transparent)`;

    this.input.style.setProperty("--responsive-gradient", gradient);
  } 
}