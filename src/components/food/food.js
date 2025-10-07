import { normalize, getRandomInt, splitColor, changedColor } from "../../common/utils.js";

import { board } from "../board.js";

import { snake } from "../snake/snake.js";

class Food {
  constructor() {
    this.element = document.createElement('div');
    this.element.id = "food";
    board.containerEl.appendChild(this.element);

    this.color = { string: 'rgb(0, 0, 0)' };
    this.color.hsl = splitColor(this.color.string);

    this.changeColor();
  }

  teleport() {
    this._generateRandomCoords();
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  _generateRandomCoords() {
    while (true) {
      const [x, y] = [
        normalize(getRandomInt(board.clip, board.container.width - board.clip - board.step * 2), board.step),
        normalize(getRandomInt(board.clip, board.container.height - board.clip - board.step * 2), board.step),
      ]; 

      if (snake.isCoordsInsideBody(x, y) || (x === this.x && y === this.y) || (x === board.container.center.x && y === board.container.center.y)) continue;
      else {
        this.x = x;
        this.y = y;
        break;
      }
    }
  }

  changeColor() {
    const randomColor = changedColor(this.color.hsl, { h: getRandomInt(0, 360), s: getRandomInt(25, 75), l: getRandomInt(25, 75)});
    console.log(randomColor);
    this.element.style.backgroundColor = randomColor;
  }
}

const food = new Food();

export { food }