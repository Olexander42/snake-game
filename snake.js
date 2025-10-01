import { sizes, color } from "./variables.js";

import { changedColor } from "./utils.js";

class Snake {
  constructor() {
  }

  ini() {
    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.turn = 0;

    // body 
    this._createSection(sizes.containerCenter.x, sizes.containerCenter.y, changedColor(color.hsl , {l: -2}), "snake-body", "head") ; 
    this._createSection(sizes.containerCenter.x - sizes.step ,sizes.containerCenter.y, color.string, "snake-body", "neck"); 
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

    snakeDiv.appendChild(element);
  }

  moveHead() {   
    this._snapshotSnake();

    this.head.style.left = `${parseInt(this.head.style.left) + this.direction.x * sizes.step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) + this.direction.y * sizes.step}px`;

    this.head.style.rotate = `${this.turn}turn`;
  }

  bodyFollows() {
    let i = 1; // because this.snakeBody[0] is head

    const moveToNextPosition = (i) => {
      const prevEl = this.snakeBodyData[i - 1];
      const currEl = this.snakeBody[i];

      const [nextLeft, nextTop, nextrotate] = [prevEl.left, prevEl.top, prevEl.rotate];

      currEl.style.left = nextLeft;
      currEl.style.top = nextTop;
      currEl.style.rotate = nextrotate;

      if (i < this.snakeBody.length - 1) moveToNextPosition(i + 1);
    }

    moveToNextPosition(i);
  }

  _snapshotSnake() {
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

  lengthenSnake() {
    this.snakeBody = document.querySelectorAll(".snake-body");
    const oldTail = this.snakeBody[this.snakeBody.length - 1];

    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.snakeBody.length}`
    snakeDiv.appendChild(this.tail);

    this._rescaleBody();;
    this._repaintTail();
  }

  _repaintTail() {
    const lighterColor = changedColor(hslMain , {l: this.snakeBody.length});
    this.tail.style.backgroundColor = lighterColor;
  }

  _rescaleBody() {
    this._snapshotSnake();

    const length = this.snakeBody.length;
    let i = length - 1;
    let j = 1;
    let scale = 0;

    const rescaleSection = () => {
      scale += 1 / (2 ** j); 
      this.snakeBody[i].style.scale = `${roundTo(scale, 2)}`;
      i--;
      j++;
      if (i > 0) rescaleSection();  
    }

    rescaleSection();
  }

  collision() {
    return (
      parseInt(this.head.style.left) < sizes.clip || parseInt(this.head.style.left) > container.width - (sizes.clip + sizes.width) // left & right border
      || parseInt(this.head.style.top) < sizes.clip || parseInt(this.head.style.top) > container.height - (sizes.clip + sizes.width) //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top)
      ) 
  }

  coordsInsideBody(x, y) {
    if (typeof x === "number") [x, y] = [x + "px", y + "px"];
    return this.snakeBody.some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))); // head is excluded
  }

  borderShrinkOffset() {
    this._snapshotSnake();

    // if snake inside top border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) < sizes.clip + sizes.step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + sizes.step + "px" );
      console.log("snake inside top border")
    }

    // if snake inside bottom border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) > container.height - sizes.clip - sizes.step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - sizes.step + "px" );
      console.log("snake inside bottom border")
    }

    // if snake inside left border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) < sizes.clip + sizes.step))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + sizes.step + "px" );
      console.log("snake inside left border")
    }
    
    // if snake inside right border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) > container.width - sizes.clip - sizes.width))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - sizes.step + "px" );
      console.log("snake inside right border")
    }


    // if food inside top border
    if (parseInt(this.food.style.top) <= sizes.clip) {
      this.food.style.top = parseInt(this.food.style.top) + sizes.width + "px";
    } 

    // if food inside bottom border
    if (parseInt(this.food.style.top) >= container.height - sizes.clip) {
      this.food.style.top = parseInt(this.food.style.top) - sizes.width + "px";
    } 

    // if food inside right border
    if (parseInt(this.food.style.left) >= container.width - sizes.clip) {
      this.food.style.left = parseInt(this.food.style.left) - sizes.width + "px";
    }

    // if food inside left border
    if (parseInt(this.food.style.left) < sizes.clip) {
      this.food.style.left = parseInt(this.food.style.left) + sizes.width + "px";
    }    

    this._ateFood(); // in case snake eats food during the offset process
  }

  nearOppositeSides() {
    return (
      (this.snakeBodyData.some((coord) => (parseInt(coord.top) <= sizes.clip + sizes.step ) 
      && this.snakeBodyData.some((coord) => (parseInt(coord.top) >= container.height - sizes.clip - sizes.step * 2))))  // top - bottom
      || ((this.snakeBodyData.some((coord) => (parseInt(coord.left) <= sizes.clip + sizes.step)))) // left - right
      && (this.snakeBodyData.some((coord) => parseInt(coord.left) >= container.width - sizes.clip - sizes.step * 2))
    )
  }
}

export { Snake }