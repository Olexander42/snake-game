const root = document.documentElement;
const html = document.querySelector("html");
const menu = document.querySelector(".menu");
const startBtn = document.querySelector(".start");
const background = document.querySelector(".background");
const container = document.querySelector(".container");
const border = document.querySelector(".border");
const snake = document.querySelector(".snake");
const score = document.querySelector(".score");
const record = document.querySelector(".record");

const step = 40;
const stats = {score: 0, record: 0};
const containerWidth = normalize(container.clientWidth);
const containerHeight = normalize(container.clientHeight);
let borderWidth = containerWidth;
let borderdHeight = containerHeight;
let intervalId = null;
let borderCenter = {};
let timeUnit = 1000;
let timeGap = 1000;


/* 
- turn off transition for turning sections
- settings (this.snakeBody color | step size | shrink(on/off) | controls (absolute/relative) | god mode)
- minmax size
*/

// VISUALS
container.style.width = containerWidth + "px";
container.style.height = containerHeight + "px";

root.style.setProperty("--step", `${step}px`);
root.style.setProperty("--time-gap", `${timeGap / 1000}s`);

let clip = step; // clip-path value to use on background inside the walls

const mainColor = "hsl(120, 100%, 25%)";

function normalize(val) {
  return (Math.round(val / step) * step);
}

function size(mode) {
  if (mode === "ini") {
     // initialization
    borderWidth = containerWidth; 
    borderHeight = containerHeight;

    border.style.width = borderWidth + "px";
    border.style.height = borderHeight + "px";
    background.style.width = borderWidth + "px";
    background.style.height = borderHeight + "px";

    borderCenter = {x: normalize(Math.round(borderWidth / 2)), y: normalize(Math.round(borderHeight / 2))};

    score.innerText = `Score: ${stats.score}`;
    record.innerText = `Record: ${stats.record}`;

  } else if (mode === "shrink") {
      // shrink border
      borderWidth = border.clientWidth - step
      borderHeight = border.clientHeight - step
      border.style.width = borderWidth + "px";
      border.style.height = borderHeight + "px";

      // clip background image
      background.style.clipPath = `inset(${clip + 1}px)`;
      clip += step/2;
    }
}

function reset() {
  border.style.width = containerWidth;
  border.style.height = containerHeight;
  background.style.clipPath = "inset(0px)";
  clip = step / 2;
  stats.score = 0;
  timeGap = 1000;
  document.querySelectorAll(".block").forEach((el) => el.remove());
}

function createElement(x, y, color, className, id="") {
  const element  = document.createElement('div');

  element.classList.add("block");
  element.classList.add(`${className}`);
  element.id = id;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.backgroundColor = color;

  if (className !== "food") snake.appendChild(element);
  else container.appendChild(element);
}


// LOGIC 
class SnakeGame {
  constructor() {
    this.ini();
  }

  ini() {
    // parameters
    this.speed = 1;
    this.direction = {x: 1, y: 0};
    this.hsl = this._splitColor();

    // snake 
    createElement(borderCenter.x, borderCenter.y, this._changedColor({l: (-2)}), "snake-body", "head") ; 
    createElement(borderCenter.x - step ,borderCenter.y, this._changedColor(), "snake-body", "neck"); 
    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");

    this._createFood();

    // shrink 
    this.counterOuter = 1;
    this.counterInner = 0;
  }

  action() {
    this._snapshotSnake();
    this._moveHead();
    if (this._collision()) {
      //this._gameOver(); 
    }
    else {
      this._bodyFollows();
      this._ateFood();
      this._repaintBody();
    }
  }

  // snake
  _moveHead() {    
    this.head.style.left = `${parseInt(this.head.style.left) + this.direction.x * step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) + this.direction.y * step}px`;
  }

  _bodyFollows() {
    let i = 1; // because this.snakeBody[0] is head
    const moveToNextPosition = (i) => {
      const [left, top] = [this.snakeBodyCoords[i - 1].left, this.snakeBodyCoords[i - 1].top];
      if (this.snakeBody[i].id === "neck") this.snakeBody[i].id = "";
      this.snakeBody[i].style.left = left;
      this.snakeBody[i].style.top = top;
      if (i < this.snakeBody.length - 1) moveToNextPosition(i + 1);
    }

    const checkTurn = () => {
      // vertical turn 
      
    }
    moveToNextPosition(i);
  }

  _snapshotSnake() {
    this.snakeBody = document.querySelectorAll(".snake-body");
    this.snakeBodyCoords = [];
    this.snakeBody.forEach((el) => {
      const [left, top] = [el.style.left, el.style.top];
      const coords = {left, top};
      this.snakeBodyCoords.push(coords);
    })
  }


  _repaintBody(ms=0) {
    return new Promise((resolve) => {
      let i = 0;

      const repaintSection = () => {
        setTimeout(() => {
          const lighterColor = this._changedColor({l: i});
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

  _lengthenSnake() {
    this.snakeBody = document.querySelectorAll(".snake-body");
    const newTail = this.snakeBody[this.snakeBody.length - 1].cloneNode(false);
    snake.appendChild(newTail);
  }

  // food 
  _createFood() {
    let [x, y] = [null, null];

    const samePlace = () => {
      if (document.querySelector(".food")) { 
        const [prevX, prevY] = [parseInt(this.food.style.left),  parseInt(this.food.style.top)]; 
        this.food.remove();
        return (x === prevX && y === prevY);
      } else return false
    }

    while (true) {
       [x, y] = [getRandomInt(step, borderWidth - step * 2), getRandomInt(step, borderHeight - step * 2)]; 
       [x, y] = [normalize(x), normalize(y)];
       if (this._coordsInsideBody(x, y) || samePlace() || (x === borderCenter.x && y === borderCenter.y)) continue;
       else break;
    }

    createElement(x, y, 'red', "food");
    this.food = document.querySelector(".food");
  }

  // general 
  _ateFood() {
    if (this.food.style.left === this.head.style.left && this.food.style.top === this.head.style.top) {
      this._createFood();
      clearInterval(intervalId);

      this._lengthenSnake();

      this.speed++;

      timeGapUpdate();

      this._checkShrink();

      stats.score++;
      score.innerText = `Score: ${stats.score}`;
      windup(); 
    }
  }

  _collision() {
    if (
      parseInt(this.head.style.left) < step || parseInt(this.head.style.left) > borderWidth - step * 2 // left & right border
      || parseInt(this.head.style.top) < step || parseInt(this.head.style.top) > borderHeight - step * 2 //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top)
      ) {
      return true;
    }

      
  }

  _coordsInsideBody(x, y) {
    if (typeof x === "number") [x, y] = [x + "px", y + "px"];
    //if ([...document.querySelectorAll(".snake-body")].some((el, i) => (i !== 0 && (x === el.style.left && y === el.style.top))))  console.log("⚠ Head inside BODY!");
    return [...document.querySelectorAll(".snake-body")].some((el, i) => (i !== 0 && (x === el.style.left && y === el.style.top))); // head is excluded
  }

  _splitColor() {
    let hsl = mainColor.match(/\d+/g);
    hsl = hsl.map((val) => Number(val)); 
    return {h: hsl[0], s: hsl[1], l: hsl[2]};
  }

  _changedColor({h = 0, s = 0, l = 0} = {}) {
    return `hsl(${this.hsl.h + h}, ${this.hsl.s + s}%, ${this.hsl.l + l}%)`
  }

  
  _checkShrink() {
    this.counterInner++;
    if (this.counterInner === this.counterOuter) {
      this.counterInner = 0;
      this.counterOuter++;
      size("shrink");
      this._shrinkOffset();
    }
  }
  
   _shrinkOffset() {
    // elements are inside right border after "shrink"
    if ([...document.querySelectorAll(".block")].some((el) => (parseInt(el.style.left) >= borderWidth - step))) {
      document.querySelectorAll(".block").forEach((el) => el.style.left = parseInt(el.style.left) - step + "px" );
    }
    // elements are inside bottom border after "shrink"
    if ([...document.querySelectorAll(".block")].some((el) => (parseInt(el.style.top) >= borderHeight - step))) {
      document.querySelectorAll(".block").forEach((el) => el.style.top = parseInt(el.style.top) - step + "px" );  
    }

    // food inside left border
    if (parseInt(this.food.style.left) < step) {this.food.style.left = parseInt(this.food.style.left) + step + "px"; console.log("⚠food inside left border");}
    // food inside top border
    if (parseInt(this.food.style.top) < step) {this.food.style.top = parseInt(this.food.style.top) + step + "px"; console.log("⚠food inside top border");} 
  }

  _shortenSnake() {

  }


  _gameOver() {
    clearInterval(intervalId);

    // "withdraw" yourself from the point of collision
    this.head.style.left = `${parseInt(this.head.style.left) - this.direction.x * step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) - this.direction.y * step}px`;

    if (stats.score > stats.record) {
      stats.record = stats.score;
    }

    this.hsl.s *= 0.15;
    this._repaintBody(timeGap)
      .then(() => wait(timeGap))
      .then(() => startBtn.style.display = "block");
  }
}


function getRandomInt(min, max) { // max excluded
  const result = Math.floor(Math.random() * ((max - min)) + min); 
  return result;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms);
  })
}

function timeGapUpdate() {
  timeGap = Math.round(timeUnit / game.speed);
  root.style.setProperty("--time-gap", `${timeGap / 1000}s`);
}



// controls 
const handleKeydown = (event) => {
  switch (event.key) {
    // prevent this.snakeBody from hitting borders up close
    case "ArrowUp":
      if (!(parseInt(game.neck.style.top) === step && game.direction.y === 0 || game.direction.y == 1)) { // top border
        game.direction.x = 0;
        game.direction.y = -1;
        html.removeEventListener("keydown", handleKeydown); // only one change per frame is allowed
      }
      break;

    case "ArrowRight":
      if (!(parseInt(game.neck.style.left) === border.clientWidth - step * 2 && game.direction.x === 0 || game.direction.x == -1)) { // top border
        game.direction.x = 1;
        game.direction.y = 0;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (!(parseInt(game.neck.style.top) === border.clientHeight - step * 2 && game.direction.y === 0 || game.direction.y === -1)) { // bottom border
        game.direction.x = 0;
        game.direction.y = 1;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowLeft":
      if (!(parseInt(game.neck.style.left) === step && game.direction.x === 0 || game.direction.x === 1)) {  // left border
        game.direction.x = -1;
        game.direction.y = 0;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "p": // pause
      if (intervalId !== 0) {
        clearInterval(intervalId);
        intervalId = 0;
      } else {
        windup(timeGap);
      }
      break;
  }
}


const controlOn = () => {
  html.addEventListener("keydown", handleKeydown);
}

const handleStartButton = () => {
  startBtn.innerText = "Start Again";
  document.querySelectorAll("button").forEach((el) => el.style.display = "none");
}
 
function windup() {
  intervalId = setInterval(() => {
    controlOn();

    game.action();
  }, timeGap); 
}

async function gameStarter() {
  handleStartButton();

  if (intervalId > 1) { // for restart
    reset();

    await wait(1000);

    size("ini");

    game.ini();
  }

  timeGapUpdate();

  windup();
}


size("ini");

const game = new SnakeGame();

startBtn.addEventListener("click", gameStarter);




