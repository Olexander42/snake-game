import Color from "../common/Color.js";
import { roundTo } from "../common/utils.js";
import getElement from "../common/elements.js";
import { TIME_UNIT } from "../common/constants.js";


class Snake {
  static ACCELERATION = 0.25;
  static DESATURATION = 0.15

  constructor() {
    this.div = document.createElement('div');
    this.div.id = "snake";
    getElement.container().append(this.div);
  }

  spawn(boardData, color) {
    this.updateBoardData(boardData);
    this.color = new Color(color);

    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.headRotation = 0;
    this.headThick = this.step * 2; // because step is half of size_unit

    // body 
    this._createSection(this.boundsCenter.x, this.boundsCenter.y, this.color.changeColor({changeL: -2}), "head") ; 
    this._createSection(this.boundsCenter.x - this.step, this.boundsCenter.y, this.color.string, "neck"); 

    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");

    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;

    this.isAlive = true;
    this.controlsOn = true;

    this._snapshot();
  }

  _createSection(x, y, color, id="") {
    const element  = document.createElement('span');

    element.classList.add("block");
    element.classList.add(`${"snake-body"}`);
    element.id = id;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.backgroundColor = color;

    this.div.append(element);
  }

  _snapshot() {
    this.body = [...document.querySelectorAll(".snake-body")];
    this.bodyData = [];

    this.body.forEach((section) => {
      const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
      const data = {x, y, rotation};

      this.bodyData.push(data);
    })

    this.headData = this.bodyData[0];
    //console.log(JSON.stringify(this.bodyData, null, 2));
  }

  makeStep() {    
    // move head 
    const [currentX, currentY] = [this.headData.x, this.headData.y]

    const stepX = Math.sign(this.direction.x) * this.step;
    const stepY = Math.sign(this.direction.y) * this.step;

    const newX = currentX + stepX;
    const newY = currentY + stepY;

    const collisionDetected = (headX, headY) => {
      return headX < this.bounds.left 
        || headX > this.bounds.right
        || headY < this.bounds.top
        || headY > this.bounds.bottom
    }

    if (!collisionDetected(newX, newY)) { 
      this.head.style.left = newX + 'px';
      this.head.style.top = newY + 'px';
      this.head.style.rotate = `${this.headRotation}turn`;

      // body follows
      let i = 1; 
      const moveToNextSection = (i) => {
        const currentSection = this.body[i];
        const nextSection = this.bodyData[i - 1];

        const [newX, newY, newRotation] = [nextSection.x, nextSection.y, nextSection.rotation];
    
        currentSection.style.left = `${newX}px`;
        currentSection.style.top = `${newY}px`;
        currentSection.style.rotate = newRotation;

        if (i < this.body.length - 1) moveToNextSection(i + 1);
      }
      moveToNextSection(i);

      this._snapshot();

    } else {
      this.isAlive = false;
    }
  }

  handleControls(arrowKey) { 
    // define
    const turnConfig = {
      Up: { direction: { x: 0, y: -1 }, axis: 'x', cww: true, border: "top" },
      Down: { direction: { x: 0, y: 1 }, axis: 'x', cww: false, border: "bottom" },
      Left: { direction: { x: -1, y: 0 }, axis: 'y', cww: false, border: "left" },
      Right: { direction: { x: 1, y: 0 }, axis: 'y', cww: true, border: "right" },
    }

    const changeRotation = (axis, counterClockwise) => { 
      let clockwiseCorrection = counterClockwise === true ? -1 : 1;
      const newRotation =  (Math.sign(this.direction[axis]) * 0.25) * clockwiseCorrection; 

      this.headRotation += newRotation;
    }

    const isAllowTurn = (axis, border) => {
      const oppositeAxis = axis === 'x' ? 'y' : 'x'; 
      
      if (
        !(this.headData[oppositeAxis] === this.bounds[border]) // snake doesn't move along top border
        && this.direction[oppositeAxis] === 0 // prevent 180° turn
      ) return true
      else {
        return false;
      }
    }

    const makeTurn = (direction) => {
      this.direction.x = direction.x;
      this.direction.y = direction.y 
    }

    // init
    const turnKey = arrowKey.slice(5, arrowKey.length); 
    const config = turnConfig[turnKey];

    // execute
    if (isAllowTurn(config.axis, config.border)) {
      changeRotation(config.axis, config.cww);
      makeTurn(config.direction);

      this.controlsOn = false; // prevent multiple turns in one step
    }
  }

  updateBoardData(data) {
    this.bounds = data.bounds;
    this.step = data.step;
    this.boundsCenter = data.center;
  }

  isAteFood(foodCoords) {
    return this.headData.x === foodCoords.x && this.headData.y === foodCoords.y;
  }

  grow() {
    const oldTail = this.body[this.body.length - 1];
    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.body.length}`
    this.tail.style.backgroundColor = this.color.changeColor({ changeL: this.body.length }); 
    this.div.append(this.tail);

    this._snapshot();
    this._rescaleBody(); // create tapering effect
  }

  _rescaleBody() { 
    const length = this.body.length;
    let i = length - 1; // tail
    let j = 1; // neck
    let scale = 0;

    // each segment from tail to neck gets decreasingly smaller
    const rescaleSection = () => { 
      scale += 1 / (2 ** j); 
      this.body[i].style.scale = `${roundTo(scale, 2)}`;

      i--;
      j++;
      if (i > 0) rescaleSection();  
    }
    rescaleSection();
  }

  speedUp() {
    this.speed += Snake.ACCELERATION;
  }

  greyout(duration) {
    let timeLeft = duration;
    let i = 0;
    let j = this.body.length + 1;

    this.color.hslComponents.s *= Snake.DESATURATION; 

    const greyoutSection = (ms) => {
      ms = timeLeft / ( 2 ** (j - i));
      timeLeft -= ms;

      // sections greyout sequentially
      setTimeout(() => {
        const color = this.color.changeColor({ changeL: i }); // the original lightness is preserved
        const section = this.body[i];
  
        section.style.backgroundColor = color;

        i++;
        if (i < this.body.length) setTimeout(() => greyoutSection(ms), ms);  
      }, ms)
    }
    greyoutSection(0);
  }
}


export default Snake;