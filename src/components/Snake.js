import Color from "../common/Color.js";
import { roundTo } from "../common/utils.js";
import getElement from "../common/getElement.js";
import { TIME_UNIT } from "../common/constants.js";


export default class Snake {
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
    this.headThick = this.step * 2; // because step is half of the default size unit

    // body 
    this._createSection(this.boardBoundsCenter.x, this.boardBoundsCenter.y, this.color.changeColor({ changeL: -2 }), "head") ; 
    this._createSection(this.boardBoundsCenter.x - this.step, this.boardBoundsCenter.y, this.color.string, "neck"); 

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
  }

  makeStep() {    
    // move head 
    const [currentX, currentY] = [this.headData.x, this.headData.y]

    const stepX = Math.sign(this.direction.x) * this.step;
    const stepY = Math.sign(this.direction.y) * this.step;

    const newX = currentX + stepX;
    const newY = currentY + stepY;

    const isHeadInsideBody = this.bodyData.some(({ x, y }, i) => (i !==0 && (newX === x && newY === y))); 

    if (!this._getCollisionBorder(newX, newY) && !isHeadInsideBody) { 
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
    const turnConfigs = {
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
        !(this.headData[oppositeAxis] === this.boardBounds[border]) // snake doesn't move along top border
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
    const config = turnConfigs[turnKey];

    // execute
    if (isAllowTurn(config.axis, config.border)) {
      changeRotation(config.axis, config.cww);
      makeTurn(config.direction);

      this.controlsOn = false; // prevent multiple turns in one step
    }
  }

  updateBoardData(data) {
    this.boardBounds = data.bounds;
    this.step = data.step;
    this.boardBoundsCenter = data.center;
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

  speedUp() {
    this.speed += Snake.ACCELERATION;
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

  isNearOppositeBorders() {
    return (
      // top and bottom border
      (this.bodyData.some(({ y }) => (y <= this.boardBounds.top + this.step) 
      && this.bodyData.some(({ y }) => (y >= this.boardBounds.bottom- this.step)))) 
      ||
      // left and right border
      ((this.bodyData.some(({ x }) => (x <= this.boardBounds.left + this.step))) 
      && (this.bodyData.some(({ x }) => (x >= this.boardBounds.right - this.step)))) 
    )
  }

  offsetShrink(data) {
    this.updateBoardData(data);

    const shiftConfigs = {
      left: { axis: "x", direction: 1, side: 'left' },
      right: { axis: "x", direction: -1, side: 'left' },
      top: { axis: "y", direction: 1, side: 'top' },
      bottom: { axis: "y", direction: -1, side: 'top' },
    }

    const shift = (config) => {
      this.bodyData.forEach((data, i) => {
        const coord = data[config.axis];
        const section = this.body[i];
        const newCoord = coord + this.step * config.direction;

        section.style[config.side] = `${newCoord}px`;
      })

      this._snapshot(); // register the changes
    }

    let verticalCollisionBorder =  null;
    let horizontalCollisionBorder = null;

    for (const data of this.bodyData) {
      // shift() can be executed only once for each border
      if (!verticalCollisionBorder) {
        verticalCollisionBorder = this._getCollisionBorder(data.x, undefined); 
        if (verticalCollisionBorder) shift(shiftConfigs[verticalCollisionBorder]);
      }

      if (!horizontalCollisionBorder) {
        horizontalCollisionBorder = this._getCollisionBorder(undefined, data.y); 
        if (horizontalCollisionBorder) shift(shiftConfigs[horizontalCollisionBorder]);
      }

      if (verticalCollisionBorder && horizontalCollisionBorder) break; // exit loop early
    }

  }

  _getCollisionBorder(x, y) {
    let collisionBorder = null;
    
    if (x < this.boardBounds.left) collisionBorder = 'left';
    else if (x > this.boardBounds.right) collisionBorder = 'right';
    else if (y < this.boardBounds.top) collisionBorder = 'top';
    else if (y > this.boardBounds.bottom) collisionBorder = 'bottom';

    return collisionBorder;
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
