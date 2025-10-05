import { normalize, getRandomInt } from "../../common/utils.js";

import { board } from "../board.js";

import { snake } from "../snake/snake.js";

class Food {
  constructor() {
    this.element = document.createElement('div');
    this.element.id = "food";
    board.containerEl.appendChild(this.element);
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
}

const food = new Food();

export { food }