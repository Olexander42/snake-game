import Color from "../common/Color.js";
import { normalize, roundTo } from "../common/utils.js";
import container from "../common/elements.js";
import { TIME_UNIT } from "../common/constants.js";

export const div = document.getElementById("snake");

export let isAlive = true;
export let controlsOn = true;

export let speed = null;



const SHIFT_CONFIGS = {
  left: { axis: "x", direction: 1, side: 'left' },
  right: { axis: "x", direction: -1, side: 'left' },
  top: { axis: "y", direction: 1, side: 'top' },
  bottom: { axis: "y", direction: -1, side: 'top' },
}

const ACCELERATION = 0.25;

const DESATURATION = 0.15;

const direction = {"x": 1, "y": 0};

let headRotation = null;
let boardBounds = null;
let step = null;
let boardCenter = null;
let snakeColor = null;

export function spawn(boardData) {
  updateBoardData(boardData);

  const snakeColor = document.querySelector('input[name="color"]:checked').value;
  snakecolor = new Color(color);

  createSection(boardCenter.x, boardCenter.y, color.changeColor({ changeL: -2 }), "head");
  createSection(boardCenter.x - step, boardCenter.y, color.string "neck"); // TODO: remove this step 

  head = document.getElementById("head");

  head.style.scale = `${1}`; 
  document.getElementById("neck");.style.scale = `${0.75}`;

  speed = 1;
  headRotation = 0;

  snapshot();
}

export function makeStep() {    
  // move head 
  const headData = bodyData[0];
  const [currentX, currentY] = [headData.x, headData.y];

  const newX = currentX + step * Math.sign(direction.x);
  const newY = currentY + step * Math.sign(direction.y);

  const isHeadInsideBody = bodyData.some(({ x, y }, i) => (i !==0 && (newX === x && newY === y))); 

  if (!getCollisionBorder(newX, newY) && !isHeadInsideBody) { 
    head.style.left = `${newX}px`;
    head.style.top = `${newY}px`;
    head.style.rotate = `${headRotation}turn`;

    bodyFollows();
    snapshot();
  } else {
    isAlive = false;
  }
}

function updateBoardData(data) { 
  boardBounds = data.bounds;
  boardCenter = { 
    x: normalize(Math.round(boardBounds.width) / 2, step),
    y: normalize(Math.round(boardBounds.height) / 2, step), 
  }

  step = data.step;
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

function snapshot() {
  body = [...document.querySelectorAll(".snake-body")];
  bodyData = [];

  body.forEach((section) => {
    const [x, y, rotation] = [parseInt(section.style.left), parseInt(section.style.top), section.style.rotate];
    const data = {x, y, rotation};

    bodyData.push(data);
  })
}

function bodyFollows(i = 1) {
  /* 'neck' takes position of 'head',
  the next-after-neck section takes position of 'neck',
  and so on. */
  const currentSection = body[i];
  const nextSection = bodyData[i - 1];

  const [newX, newY, newRotation] = [nextSection.x, nextSection.y, nextSection.rotation];

  currentSection.style.left = `${newX}px`;
  currentSection.style.top = `${newY}px`;
  currentSection.style.rotate = newRotation;

  if (i < body.length - 1) bodyFollows(i + 1);
}



export function handleControls(arrowKey) { 
  const TURN_CONFIGS = {
    Up: { newDirection: { x: 0, y: -1 }, axis: 'x', counterClockwiseRotation: true, border: "top" },
    Down: { newDirection: { x: 0, y: 1 }, axis: 'x', counterClockwiseRotation: false, border: "bottom" },
    Left: { newDirection: { x: -1, y: 0 }, axis: 'y', counterClockwiseRotation: false, border: "left" },
    Right: { newDirection: { x: 1, y: 0 }, axis: 'y', counterClockwiseRotation: true, border: "right" },
  }

  const turnKey = arrowKey.slice(5, arrowKey.length); 
  const config = TURN_CONFIGS[turnKey];

  const oppositeAxis = config.axis === 'x' ? 'y' : 'x'; 
  const isSnakeMovingAlongBorder = headData[oppositeAxis] === boardBounds[config.border];

  // prevent 180° and into border turns
  if (!isSnakeMovingAlongBorder && Math.abs(direction[config.axis]) === 1) { 
    const TURN_ROTATION = 0.25;
    let clockwiseCorrection = config.counterClockwiseRotation === true ? -1 : 1;
    headRotation += (Math.sign(direction[config.axis]) * TURN_ROTATION) * clockwiseCorrection;

    direction.x = config.newDirection.x;
    direction.y = config.newDirection.y 

    controlsOn = false; // prevent multiple turns in one frame
  }
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

