import Color from "../common/Color.js";
import { roundTo } from "../common/utils.js";
import getElement from "../common/elements.js";


class Snake {
  constructor() {
    this.div = document.createElement('div');
    this.div.id = "snake";
    getElement.container().append(this.div);
  }

  spawn(boardData, color) {
    this.getBoardData(boardData);
    this.color = new Color(color);

    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.headRotation = 0;
    this.headThick = this.step * 2; // because step is half of size_unit

    // body 
    this._createSection(this.boundsCenter.x, this.boundsCenter.y, this.color.changedColor({changeL: -2}), "head") ; 
    this._createSection(this.boundsCenter.x - this.step, this.boundsCenter.y, this.color.string, "neck"); 

    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");

    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;

    this.alive = true;
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
      if (
        headX < this.bounds.left 
        || headX > this.bounds.right
        || headY < this.bounds.top
        || headY > this.bounds.bottom
      ) return true;
      else {
        return false;
      }
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
    
        currentSection.style.left = newX + 'px';
        currentSection.style.top = newY + 'px';
        currentSection.style.rotate = newRotation;

        if (i < this.body.length - 1) moveToNextSection(i + 1);
      }
      moveToNextSection(i);

      this._snapshot();
    } else {
      this.alive = false;
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

  getBoardData(data) {
    this.bounds = data.bounds;
    this.step = data.step;
    this.boundsCenter = data.center;
  }

  delete() {
    this.div.replaceChildren();
  }
}

/*

  repaintBody() { // under construction to work with RAF
    /*
    let i = 0;
    const repaintSection = (i) => {
      const lighterColor = changedColor(this.color.hsl, {l: i});
      const section = this.body[i];

      section.style.backgroundColor = lighterColor;

      i++;
  }

  lengthen() {
    this._snapshot(); // test without it

    const oldTail = this.body[this.body.length - 1];
    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.body.length}`
    this.div.append(this.tail);

    this._rescaleBody();
    this._repaintTail();
  }


  _repaintTail() {
    const lighterColor = changedColor(this.color.hsl , {l: this.body.length});
    this.tail.style.backgroundColor = lighterColor;
  }

  _rescaleBody() {
    this._snapshot(); // try move it outside

    const length = this.body.length;
    let i = length - 1;
    let j = 1; 
    let scale = 0;

    const rescaleSection = () => { 
      // rescale from tail to neck
      scale += 1 / (2 ** j); 
      snake.body[i].style.scale = `${roundTo(scale, 2)}`;
      i--;
      j++;
      if (i > 0) rescaleSection();  
    }

    rescaleSection();
  }
}
*/

// helpers



export default Snake;