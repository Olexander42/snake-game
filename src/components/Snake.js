import Color from "../common/Color.js";
import { roundTo } from "../common/utils.js";
import container from "../common/elements.js";
import { TIME_UNIT } from "../common/constants.js";


let isAlive = true;
let controlsOn = true;

const TURN_CONFIGS = {
  Up: { direction: { x: 0, y: -1 }, axis: 'x', cww: true, border: "top" },
  Down: { direction: { x: 0, y: 1 }, axis: 'x', cww: false, border: "bottom" },
  Left: { direction: { x: -1, y: 0 }, axis: 'y', cww: false, border: "left" },
  Right: { direction: { x: 1, y: 0 }, axis: 'y', cww: true, border: "right" },
}

const SHIFT_CONFIGS = {
  left: { axis: "x", direction: 1, side: 'left' },
  right: { axis: "x", direction: -1, side: 'left' },
  top: { axis: "y", direction: 1, side: 'top' },
  bottom: { axis: "y", direction: -1, side: 'top' },
}

const ACCELERATION = 0.25;
const TURN_ROTATION = 0.25;
const DESATURATION = 0.15;

const direction = {"x": 1, "y": 0};

let speed = 1;
let headRotation = 0;

let div = null;
let boardBounds = null;
let step = null;
let boardBoundsCenter = null;
let snakeColor = null;
let headThick = null;


export function spawn(boardData) {
  updateBoardData(boardData);

  div = document.createElement('div');
  div.id = "snake";
  container.append(div);

  const snakeColor = document.querySelector('input[name="color"]:checked').value;
  snakecolor = new Color(color);

  speed = 1;
  headRotation = 0;
  direction = {"x": 1, "y": 0};

  headThick = step * 2; // because step is half of the default size unit

  createSection(boardBoundsCenter.x, boardBoundsCenter.y, color.changeColor({ changeL: -2 }), "head") ; 
  createSection(boardBoundsCenter.x - step, boardBoundsCenter.y, color.string, "neck"); 

  head = document.getElementById("head");
  neck = document.getElementById("neck");

  head.style.scale = `${1}`;
  neck.style.scale = `${0.75}`;

  snapshot();
}

function updateBoardData(data) {
  boardBounds = data.bounds;
  step = data.step;
  boardBoundsCenter = data.center;
}

function createSection(x, y, color, id="") {
  const element  = document.createElement('span');

  element.classList.add("block");
  element.classList.add(`${"snake-body"}`);
  element.id = id;

  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.backgroundColor = color;

  div.append(element);
}





  _snapshot() {
    body = [...document.querySelectorAll(".snake-body")];
    bodyData = [];

    body.forEach((section) => {
      const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
      const data = {x, y, rotation};

      bodyData.push(data);
    })

    headData = bodyData[0];
  }

  makeStep() {    
    // move head 
    const [currentX, currentY] = [headData.x, headData.y]

    const stepX = Math.sign(direction.x) * step;
    const stepY = Math.sign(direction.y) * step;

    const newX = currentX + stepX;
    const newY = currentY + stepY;

    const isHeadInsideBody = bodyData.some(({ x, y }, i) => (i !==0 && (newX === x && newY === y))); 

    if (!_getCollisionBorder(newX, newY) && !isHeadInsideBody) { 
      head.style.left = newX + 'px';
      head.style.top = newY + 'px';
      head.style.rotate = `${headRotation}turn`;

      _bodyFollows();

      _snapshot();
    } else {
      isAlive = false;
    }
  }

  _bodyFollows(i = 1) {
    const currentSection = body[i];
    const nextSection = bodyData[i - 1];

    const [newX, newY, newRotation] = [nextSection.x, nextSection.y, nextSection.rotation];

    currentSection.style.left = `${newX}px`;
    currentSection.style.top = `${newY}px`;
    currentSection.style.rotate = newRotation;

    if (i < body.length - 1) _bodyFollows(i + 1);
  }

  handleControls(arrowKey) { 
    const turnKey = arrowKey.slice(5, arrowKey.length); 
    const config = Snake.TURN_CONFIGS[turnKey];

    // execute
    if (_isAllowTurn(config.axis, config.border)) {
      _changeRotation(config.axis, config.cww);
      _makeTurn(config.direction);

      controlsOn = false; // prevent multiple turns in one step
    }
  }

  _changeRotation(axis, counterClockwise) {
    let clockwiseCorrection = counterClockwise === true ? -1 : 1;
    const newRotation =  (Math.sign(direction[axis]) * Snake.TURN_ROTATION) * clockwiseCorrection; 

    headRotation += newRotation;
  }

  _isAllowTurn(axis, border) {
    const oppositeAxis = axis === 'x' ? 'y' : 'x'; 
    
    if (
      !(headData[oppositeAxis] === boardBounds[border]) // snake doesn't move along top border
      && direction[oppositeAxis] === 0 // prevent 180° turn
    ) return true
    else {
      return false;
    }
  }

  _makeTurn(direction) {
    direction.x = direction.x;
    direction.y = direction.y 
  }



  isAteFood(foodCoords) {
    return headData.x === foodCoords.x && headData.y === foodCoords.y;
  }

  grow() {
    const oldTail = body[body.length - 1];
    if (oldTail.id === "tail") oldTail.id = "";

    tail = oldTail.cloneNode(false);
    tail.id = "tail";
    tail.style.zIndex = `-${body.length}`
    tail.style.backgroundColor = color.changeColor({ changeL: body.length }); 
    div.append(tail);

    _snapshot();
    _rescaleBody(); // create tapering effect
  }

  speedUp() {
    speed += ACCELERATION;
  }

  _rescaleBody() { 
    const length = body.length;
    let i = length - 1; // tail
    let j = 1; // neck
    let scale = 0;

    // each segment from tail to neck gets decreasingly smaller
    const rescaleSection = () => { 
      scale += 1 / (2 ** j); 
      body[i].style.scale = `${roundTo(scale, 2)}`;

      i--;
      j++;
      if (i > 0) rescaleSection();  
    }
    rescaleSection();
  }

  isNearOppositeBorders() {
    return (
      // top and bottom border
      (bodyData.some(({ y }) => (y <= boardBounds.top + step) 
      && bodyData.some(({ y }) => (y >= boardBounds.bottom- step)))) 
      ||
      // left and right border
      ((bodyData.some(({ x }) => (x <= boardBounds.left + step))) 
      && (bodyData.some(({ x }) => (x >= boardBounds.right - step)))) 
    )
  }

  offsetShrink(data) {
    updateBoardData(data);

    let verticalCollisionBorder =  null;
    let horizontalCollisionBorder = null;

    for (const data of bodyData) {
      // _shift() can be executed only once for each border
      if (!verticalCollisionBorder) {
        verticalCollisionBorder = _getCollisionBorder(data.x, undefined); 
        if (verticalCollisionBorder) _shift(Snake.SHIFT_CONFIGS[verticalCollisionBorder]);
      }

      if (!horizontalCollisionBorder) {
        horizontalCollisionBorder = _getCollisionBorder(undefined, data.y); 
        if (horizontalCollisionBorder) _shift(Snake.SHIFT_CONFIGS[horizontalCollisionBorder]);
      }

      if (verticalCollisionBorder && horizontalCollisionBorder) break; // exit loop early
    }
  }

  _shift(config) {
    bodyData.forEach((data, i) => {
      const coord = data[config.axis];
      const section = body[i];
      const newCoord = coord + step * config.direction;

      section.style[config.side] = `${newCoord}px`;
    })

    _snapshot(); // register the changes
  }

  _getCollisionBorder(x, y) {
    let collisionBorder = null;
    
    if (x < boardBounds.left) collisionBorder = 'left';
    else if (x > boardBounds.right) collisionBorder = 'right';
    else if (y < boardBounds.top) collisionBorder = 'top';
    else if (y > boardBounds.bottom) collisionBorder = 'bottom';

    return collisionBorder;
  }

  greyout(duration) {
    let timeLeft = duration;
    let i = 0;
    let j = body.length + 1;
  
    color.hslComponents.s *= Snake.DESATURATION; 

    const greyoutSection = (ms) => {
      ms = timeLeft / ( 2 ** (j - i));
      timeLeft -= ms;
      // sections greyout sequentially
      setTimeout(() => {
        const color = color.changeColor({ changeL: i }); // the original lightness is preserved
        const section = body[i];
  
        section.style.backgroundColor = color;

        i++;
        if (i < body.length) setTimeout(() => greyoutSection(ms), ms);  
      }, ms)
    }
    greyoutSection(0);
  }
}
