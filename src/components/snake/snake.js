import { board } from "../board/board.js";
import { splitColor, changedColor, roundTo } from "../../common/utils.js";


class Snake {
  constructor() {
    this.div = document.getElementById("snake");
  }

  init() {
    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.turn = 0;
    this.color = { string: "hsl(120, 100%, 25%)" };
    this.color.hsl = splitColor(this.color.string);

    // body 
    this._createSection(board.container.center.x, board.container.center.y, changedColor(this.color.hsl , {l: -2}), "head") ; 
    this._createSection(board.container.center.x - board.step ,board.container.center.y, this.color.string, "neck"); 
    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");
    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;

    this._snapshot();
  }

  _createSection(x, y, col, id="") {
    const element  = document.createElement('div');

    element.classList.add("block");
    element.classList.add(`${"snake-body"}`);
    element.id = id;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.backgroundColor = col;

    this.div.appendChild(element);
  }

  moveHead() {   
    this._snapshot();

    this.head.style.left = `${parseInt(this.head.style.left) + this.direction.x * board.step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) + this.direction.y * board.step}px`;
    this.head.style.rotate = `${this.turn}turn`;
  }

  bodyFollows() {
    let i = 1; // because this.snakeBody[0] is head

    const moveToNextPosition = (i) => {
      const prevEl = this.snakeBodyData[i - 1];
      const currEl = this.snakeBody[i];

      const [nextLeft, nextTop, nextRotate] = [prevEl.left, prevEl.top, prevEl.rotate];

      currEl.style.left = nextLeft;
      currEl.style.top = nextTop;
      currEl.style.rotate = nextRotate;

      if (i < this.snakeBody.length - 1) moveToNextPosition(i + 1);
    }

    moveToNextPosition(i);
  }

  _snapshot() {
    this.snakeBody = [...document.querySelectorAll(".snake-body")];
    this.snakeBodyData = [];
    this.snakeBody.forEach((el) => {
      const [left, top, rotate] = [el.style.left, el.style.top, el.style.rotate];
      const data = {left, top, rotate};
      this.snakeBodyData.push(data);
    })
  }

  repaintBody(ms=0) {
    return new Promise((resolve) => {
      let i = ms === 0 ? 1 : 0; // only go to head upon death

      const repaintSection = () => {
        setTimeout(() => {
          const lighterColor = changedColor(this.color.hsl, {l: i});
          const s = this.snakeBody[i];

          s.style.backgroundColor = lighterColor;

          i++;
          if (i < this.snakeBody.length) repaintSection();  
          else {
            resolve(true);
          }
        }, ms);
      };

      repaintSection(i);
    })
  }

  lengthen() {
    this._snapshot(); // test without it

    const oldTail = this.snakeBody[this.snakeBody.length - 1];
    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.snakeBody.length}`
    this.div.appendChild(this.tail);

    this._rescaleBody();
    this._repaintTail();
  }

  _repaintTail() {
    const lighterColor = changedColor(this.color.hsl , {l: this.snakeBody.length});
    this.tail.style.backgroundColor = lighterColor;
  }

  _rescaleBody() {
    this._snapshot(); // try move it outside

    const length = this.snakeBody.length;
    let i = length - 1;
    let j = 1; 
    let scale = 0;

    const rescaleSection = () => { 
      // move from tail to neck
      scale += 1 / (2 ** j); 
      snake.snakeBody[i].style.scale = `${roundTo(scale, 2)}`;
      i--;
      j++;
      if (i > 0) rescaleSection();  
    }

    rescaleSection();
  }

  collision() {
    return (
      parseInt(this.head.style.left) < board.clip // left border
      || parseInt(this.head.style.left) > board.container.width - board.clip - board.thick // right border
      || parseInt(this.head.style.top) < board.clip // top border
      || parseInt(this.head.style.top) > board.container.height - board.clip - board.thick // bottom border
      || this.isCoordsInsideBody(this.head.style.left, this.head.style.top)
    ) 
  }

  isCoordsInsideBody(x, y) {
    if (typeof x === "number") [x, y] = [x + "px", y + "px"];
    return this.snakeBody.some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))); // head is excluded
  }
}

const snake = new Snake();


export { snake };