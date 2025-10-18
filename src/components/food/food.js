import { board } from "../board/board.js";
import { snake } from "../snake/snake.js";
import { normalize, getRandomInt, splitColor, changedColor } from "../../common/utils.js";


class Food {
  constructor() {
    this.element = document.createElement('span');
    this.element.id = "food";
    board.containerEl.appendChild(this.element);

    this.color = { string: 'hsl(0, 0%, 0%)' };
    this.color.hsl = splitColor(this.color.string);
    this.color.string = changedColor(this.color.hsl, { h: getRandomInt(0, 360), s: getRandomInt(50, 100), l: getRandomInt(25, 75)});
    this.element.style.setProperty('--color', this.color.string); // have to set color from the get-go for the fade-in to work
  }

  teleport() {
    this._generateRandomCoords();
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
    this.element.style.setProperty("--transition", 'opacity 1s linear')
    requestAnimationFrame(() => food.element.style.opacity = 1);
    this.element.addEventListener('transitionend', () => this.element.style.setProperty("--transition", 'no transition')); 
  }


  _generateRandomCoords() {
    while (true) {
      const [x, y] = [
        normalize(getRandomInt(board.clip, board.container.width - board.clip - board.step * 2), board.step),
        normalize(getRandomInt(board.clip, board.container.height - board.clip - board.step * 2), board.step),
      ]; 

      if (
        snake.isCoordsInsideBody(x, y) 
        || (x === this.x && y === this.y) 
        || (x === board.container.center.x && y === board.container.center.y)
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
        this.element.style.setProperty("--pseudo-transition", "opacity 1s linear"); //  css will transition from opaque to transparent
      }
    }

   switchOpacity();
  }
}

const food = new Food();


export { food }