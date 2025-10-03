import { splitColor, changedColor, roundTo } from './utils.js';

import { board } from '../../ui/board/board.js';

const color = { string: "hsl(120, 100%, 25%)" }
color.hsl = splitColor(color.string);

class Snake {
  constructor() {
    this.div = document.querySelector(".snake")
  }

  ini() {
    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.turn = 0;

    // body 
    this._createSection(board.container.center.x, board.container.center.y, changedColor(color.hsl , {l: -2}), "head") ; 
    this._createSection(board.container.center.x - board.step ,board.container.center.y, color.string, "neck"); 
    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");

    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;
  }

  _createSection(x, y, color, id="") {
    const element  = document.createElement('div');

    element.classList.add("block");
    element.classList.add(`${"snake-body"}`);
    element.id = id;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.backgroundColor = color;

    this.snakeDiv.appendChild(element);
  }

  moveHead() {   
    this.snapshot();

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

  snapshot() {
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
      let i;
      ms === 0 ? i = 1 : i = 0; // only go to head upon death
      const repaintSection = () => {
        setTimeout(() => {
          const lighterColor = changedColor(hslMain , {l: i});
          const s = this.snakeBody[i];
          s.style.backgroundColor = lighterColor;
          i++;
          if (i < this.snakeBody.length) {
            repaintSection();  
          } else {
            resolve(true);
          }
        }, ms);
      };

      repaintSection(i);
    })
  }

  lengthen() {
    this.snakeBody = document.querySelectorAll(".snake-body");
    const oldTail = this.snakeBody[this.snakeBody.length - 1];

    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.snakeBody.length}`
    this.snakeDiv.appendChild(this.tail);

    this._rescaleBody();
    this._repaintTail();
  }

  _repaintTail() {
    const lighterColor = changedColor(hslMain , {l: this.snakeBody.length});
    this.tail.style.backgroundColor = lighterColor;
  }

  _rescaleBody() {
    this.snapshot();

    const length = this.snakeBody.length;
    let i = length - 1;
    let j = 1;
    let scale = 0;

    const rescaleSection = () => {
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
      parseInt(this.head.style.left) < board.clip || parseInt(this.head.style.left) > board.container.width - (board.clip + board.width) // left & right border
      || parseInt(this.head.style.top) < board.clip || parseInt(this.head.style.top) > board.container.height - (board.clip + board.width) //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top)
      ) 
  }

  isCoordsInsideBody(x, y) {
    if (typeof x === "number") [x, y] = [x + "px", y + "px"];
    return this.snakeBody.some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))); // head is excluded
  }


  offsetShrink() {
    this.snapshot();

    // if snake inside top border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) < board.clip + board.step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + board.step + "px" );
      console.log("snake inside top border")
    }

    // if snake inside bottom border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) > board.container.height - board.clip - board.step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - board.step + "px" );
      console.log("snake inside bottom border")
    }

    // if snake inside left border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) < board.clip + board.step))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + board.step + "px" );
      console.log("snake inside left border")
    }
    
    // if snake inside right border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) > board.container.width - board.clip - board.width))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - board.step + "px" );
      console.log("snake inside right border")
    }
    //ateFood(); // in case snake eats food during the offset process // find a way to implement it
  }

  isNearOppositeSides() {
    return (
      (this.snakeBodyData.some((coord) => (parseInt(coord.top) <= board.clip + board.step ) 
      && this.snakeBodyData.some((coord) => (parseInt(coord.top) >= board.container.height - board.clip - board.step * 2))))  // top - bottom
      || ((this.snakeBodyData.some((coord) => (parseInt(coord.left) <= board.clip + board.step)))) // left - right
      && (this.snakeBodyData.some((coord) => parseInt(coord.left) >= board.container.width - board.clip - board.step * 2))
    )
  }

  withdrawHead() {
    this.head.style.left = `${parseInt(this.head.style.left) - this.direction.x * board.step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) - this.direction.y * board.step}px`;
  }
}

const snake = new Snake();

export { snake, color };