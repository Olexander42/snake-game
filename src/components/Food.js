import { normalize, getRandomInt, splitColor, changedColor } from "../../common/utils.js";
import { TIME_UNIT, center } from "../../common/constants.js";
import { isCoordsInsideArray } from "../../common/helpers.js";
import { container } from "../../common/elements.js";


class Food {
  constructor() {
    this.element = document.createElement('span');
    this.element.id = "food";
    board.containerEl.append(this.element);

    this.color = { string: 'hsl(0, 0%, 0%)' };
    this.color.hsl = splitColor(this.color.string);
    this.color.string = changedColor(this.color.hsl, { h: getRandomInt(0, 360), s: getRandomInt(50, 100), l: getRandomInt(25, 75)});
    this.element.style.setProperty('--color', this.color.string); // have to set color from the get-go for the fade-in to work
  }

  teleport() {
    this.generateRandomCoords();
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  changeColor() {
    this.element.style.setProperty("--prev-color", this.color.string);
    this.color.string = changedColor(this.color.hsl, { h: getRandomInt(0, 360), s: getRandomInt(50, 100), l: getRandomInt(25, 75)});

    this._changePseudoOpacity(); // hide #food with fully opaque ::before
    requestAnimationFrame(() => this.element.style.setProperty("--color", this.color.string));  // then change color of #food
  }

  fadeIn() {
    this.element.style.setProperty("--transition", `opacity ${TIME_UNIT / 1000}s linear`)
    requestAnimationFrame(() => food.element.style.opacity = 1);
    this.element.addEventListener('transitionend', () => this.element.style.setProperty("--transition", 'no transition')); 
  }


  generateRandomCoords(snakeBodyData) {
    const clip = parseInt(root.getPropertyValue("--clip"));
    while (true) {
      const [x, y] = [
        normalize(getRandomInt(clip, container.clientWidth - clip - size_unit.value * 2), size_unit.value),
        normalize(getRandomInt(clip, container.clientHeight - clip - size_unit.value * 2), size_unit.value),
      ]; 

      if (
        isCoordsInsideArray(x, y, snakeBodyData) 
        || (x === this.x && y === this.y) 
        || (x === center.x && y === center.y)
      ) continue;
      else {
        this.x = x;
        this.y = y;

        break;
      }
    }
  }

  _changePseudoOpacity() { //
    let opacity = 0;

    this.element.style.setProperty("--color", this.color.string)
    
    const switchOpacity = () => {
      opacity = opacity === 1 ? 0 : 1;
      this.element.style.setProperty("--pseudo-opacity", opacity);
      if (opacity === 1) {
        this.element.style.setProperty("--pseudo-transition", "no transition"); // immediately switch to the new color
        requestAnimationFrame(switchOpacity);
      } else {
        this.element.style.setProperty("--pseudo-transition", `opacity ${TIME_UNIT / 500}s linear`); //  css will transition from opaque to transparent
      }
    }

   switchOpacity();
  }
}


export default Food;