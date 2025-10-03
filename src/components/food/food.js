import { normalize, getRandomInt } from '../../common/utils.js';

import { board } from '../../ui/board/board.js';

import { snake } from '../snake/snake.js';

class Food {
  constructor() {
    this.element = document.getElementById("food");
    [this.x, this.y] = [null, null];
  }

  teleport() {
    this._generateRandomCoords();
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  _generateRandomCoords() {
    while (true) {
      const [x, y] = [
        normalize(getRandomInt(board.clip + board.step, board.container.width - board.clip - board.step * 2), board.step),
        normalize(getRandomInt(board.clip + board.step, board.container.height - board.clip - board.step * 2), board.step),
      ]; 

      if (snake.coordsInsideBody(x, y) || (x === this.x && y === this.y) || (x === board.container.center.x && y === board.container.center.y)) continue;
      else {
        this.x = x;
        this.y = y;
        break;
      }
    }
  }

  offsetShrink() {
    // if food inside top border
    if (parseInt(this.element.style.top) <= board.clip) {
      this.element.style.top = parseInt(this.element.style.top) + board.thickness + "px";
    } 

    // if food inside bottom border
    if (parseInt(this.element.style.top) >= board.container.height - board.clip) {
      this.element.style.top = parseInt(this.element.style.top) - board.thickness + "px";
    } 

    // if food inside right border
    if (parseInt(this.element.style.left) >= board.container.width - board.clip) {
      this.element.style.left = parseInt(this.element.style.left) - board.thickness + "px";
    }

    // if food inside left border
    if (parseInt(this.element.style.left) < board.clip) {
      this.element.style.left = parseInt(this.element.style.left) + board.thickness + "px";
    }
  }
}

const food = new Food();

export { food }