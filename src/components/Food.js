import Color from "../common/Color.js";
import getElement from "../common/elements.js";
import { normalize, getRandomInt } from "../common/utils.js";
import { TIME_UNIT, MILISECONDS_IN_SECOND } from "../common/constants.js";


class Food {
  constructor() { // invisible food element is created off board 
    this.element = document.createElement('span');
    this.element.id = "food";
    this.element.style.opacity = 0;
    getElement.container().append(this.element);

    this.color = new Color();
    this.element.style.setProperty( // have to set color from the get-go for the fade-in to work
      '--color',
      this.color.changedColor(
        { 
          changeH: getRandomInt(0, 360),
          changeS: getRandomInt(50, 100),
          changeL: getRandomInt(25, 75),
        }
      )
    ) 
  }

  teleport(boardData, snakeData) {
    // generate random coords
    const bounds = boardData.bounds;
    const step = boardData.step;
    this.coords = {}

    while (true) {
      this.coords.x = normalize(getRandomInt(bounds.left, bounds.right), step);
      this.coords.y = normalize(getRandomInt(bounds.top, bounds.bottom), step);

      if (!snakeData.includes(this.coords)) break;
    }

    // apply
    this.element.style.left = `${this.coords.x}px`;
    this.element.style.top = `${this.coords.y}px`;
  }

  fadeIn() {
    this.element.style.setProperty("--transition", `opacity ${TIME_UNIT / MILISECONDS_IN_SECOND }s linear`)
    this.element.addEventListener('transitionend', () => this.element.style.setProperty("--transition", 'no transition'));
    requestAnimationFrame(() => this.element.style.opacity = 1); 
  }

  /*
  changeColor() {
    this.element.style.setProperty("--prev-color", this.color.string);
    this.color.string = changedColor(this.color.hsl, { h: getRandomInt(0, 360), s: getRandomInt(50, 100), l: getRandomInt(25, 75)});

    this._changePseudoOpacity(); // hide #food with fully opaque ::before
    requestAnimationFrame(() => this.element.style.setProperty("--color", this.color.string));  // then change color of #food
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
  */
}


export default Food;