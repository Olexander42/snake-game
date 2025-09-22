const root = document.documentElement;
const html = document.querySelector("html");
const menu = document.querySelector(".menu");
const startBtn = document.querySelector(".start");
const background = document.querySelector(".background");
const container = document.querySelector(".container");
const snake = document.querySelector(".snake");
const score = document.querySelector(".score");
const record = document.querySelector(".record");


const stats = {score: 0, record: 0};
let playgroundWidth = 0;
let playgroundHeight = 0;
let intervalId = 0;
let playgroundCenter = {};
let ms = 1000;


/* 
- settings (this.snakeBody color | step size | shrink(on/off) | controls (absolute/relative) | god mode)
- minmax size
*/

// VISUALS
const step = 40;
root.style.setProperty("--step", `${step}px`);

let clip = step / 2; // clip-path value to use on background inside the walls

const mainColor = "hsl(120, 100%, 25%)";

function size(mode) {
  if (mode === "ini") {
     // "round" dimensions
    containerWidth = Math.round(container.clientWidth / step) * step;
    containerHeight = Math.round(container.clientHeight / step) * step;
    container.style.width = containerWidth + "px";
    container.style.height = containerHeight + "px";
    background.style.width = containerWidth + "px";
    background.style.height = containerHeight + "px";

    score.innerText = `Score: ${stats.score}`;
    record.innerText = `Record: ${stats.record}`;
  } else if (mode === "shrink") {
      // shrink container
      container.style.width = container.clientWidth - step + "px";
      container.style.height = container.clientHeight - step + "px";

      // clip background image
      background.style.clipPath = `inset(${clip + 1}px)`;
      clip += step/2;
    }

  playgroundWidth = container.clientWidth / step;
  playgroundHeight = container.clientHeight / step;

  playgroundCenter = {x: Math.floor(playgroundWidth / 2), y: Math.floor(playgroundHeight / 2)};
}

function reset() {
  container.style.width = "";
  container.style.height = "";
  background.style.clipPath = "none";
  clip = step / 2;
  stats.score = 0;
  document.querySelectorAll(".block").forEach((el) => el.remove());
}

function createElement(x, y, color, className, id="") {
  const element  = document.createElement('div');

  element.classList.add("block");
  element.classList.add(`${className}`);
  element.id = id;
  element.style.left = `${x * step}px`;
  element.style.top = `${y * step}px`;
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
    createElement(playgroundCenter.x, playgroundCenter.y, this._changedColor({l: (-2)}), "snake-body", "head") ; 
    createElement(playgroundCenter.x - 1, playgroundCenter.y, this._changedColor(), "snake-body", "neck"); 
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
      this._gameOver(); 
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
      this.head.style.backgroundColor = this._changedColor({l: (-2)});

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

  // food 
  _createFood() {
    let [x, y] = [1, 1];

    const samePlace = () => {
      if (document.querySelector(".food")) { 
        const [foodX, foodY] = [parseInt(this.food.style.left) / step,  parseInt(this.food.style.top) / step]; 
        this.food.remove();
        return (x === foodX && y === foodY);
      } else return false
    }

    while (true) {
       [x, y] = [getRandomInt(2, playgroundWidth - 1), getRandomInt(2, playgroundHeight - 1)]; 
       if (this._coordsInsideBody(x, y, "food") || samePlace() || (x === playgroundCenter.x && y === playgroundCenter.y)) continue;
       else break;
    }

    createElement(x, y, 'red', "food");
    this.food = document.querySelector(".food");
  }

  // general 
  _ateFood() {
    if (this.food.style.left === this.head.style.left && this.food.style.top === this.head.style.top) {
      clearInterval(intervalId);

      this.snakeBody = document.querySelectorAll(".snake-body");
      const newTail = this.snakeBody[this.snakeBody.length - 1].cloneNode(false);
      snake.appendChild(newTail);

      this._checkShrink();
      this._createFood();

      stats.score++;
      this.speed++;
      score.innerText = `Score: ${stats.score}`;

      windup(this.speed); 
    }
  }

  _collision() {
    if (
      parseInt(this.head.style.left) < step || parseInt(this.head.style.left) > container.clientWidth - step * 2 // left & right border
      || parseInt(this.head.style.top) < step || parseInt(this.head.style.top) > container.clientHeight - step * 2 //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top, "head")
      ) {
      console.log(container.clientWidth, container.clientHeight);
      console.log(this.head.style.left, this.head.style.top);
      //return true;
    }

      
  }

  _coordsInsideBody(x, y, obj) {
    if (obj === "food") {
      x *= step;
      y *= step;
      x = x + "px";
      y = y + "px";
    } 
    if ([...document.querySelectorAll(".snake-body")].some((el, i) => (i !== 0 && (x === el.style.left && y === el.style.top))))  console.log("⚠ Head inside BODY!");
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
    if (this.counterInner < this.counterOuter) {
      this.counterInner++;
      if (this.counterInner >= this.counterOuter) {
        this.counterInner = 0;
        this.counterOuter++;
        size("shrink");
        //wait(ms / this.speed)
        this._snakeShrinkCorrection();
      }
    }
  }
  
   _snakeShrinkCorrection() {
    // this.snakeBody is inside right border after "shrink"
    if ([...document.querySelectorAll(".block")].some((el) => (parseInt(el.style.left) === container.clientWidth - step))) {
      document.querySelectorAll(".block").forEach((el) => el.style.left = parseInt(el.style.left) - step + "px" );
    }
    // this.snakeBody is inside bottom border after "shrink"
    if ([...document.querySelectorAll(".block")].some((el) => (parseInt(el.style.top) === container.clientHeight - step))) {
      document.querySelectorAll(".block").forEach((el) => el.style.top = parseInt(el.style.top) - step + "px" );
    }
  }


  _gameOver() {
    clearInterval(intervalId);

    // "withdraw" yourself from the point of collision
    //this.head.style.left = `${parseInt(this.head.style.left) - this.direction.x * step}px`;
    //this.head.style.top = `${parseInt(this.head.style.top) - this.direction.y * step}px`;
    //this.neck.remove();

    if (stats.score > stats.record) {
      stats.record = stats.score;
    }

    this.hsl.s *= 0.15;
    this._repaintBody(ms / this.speed / 2)
      .then(() => wait(ms / this.speed / 2))
      .then(() => startBtn.style.display = "block");
  }
}


function getRandomInt(min, max) {
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
      if (!(parseInt(game.neck.style.left) === container.clientWidth - step * 2 && game.direction.x === 0 || game.direction.x == -1)) { // top border
        game.direction.x = 1;
        game.direction.y = 0;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (!(parseInt(game.neck.style.top) === container.clientHeight - step * 2 && game.direction.y === 0 || game.direction.y === -1)) { // bottom border
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
        windup(game.speed);
      }
      break;
  }
}


const controlOn = () => {
  html.addEventListener("keydown", handleKeydown);
}

const handleStartButton = () => {
  startBtn.innerText = "Start Again";
  startBtn.style.setProperty("width", "max-content");
  document.querySelectorAll("button").forEach((el) => el.style.display = "none");
}
 
function windup(speed) {
  intervalId = setInterval(() => {
    controlOn();

    root.style.setProperty("--time-gap", `${ms / speed / 1000}s`);

    game.action();
  }, ms / speed); 
}

const gameStarter = () => {
  if (intervalId > 1) { // for restart
    reset();

    size("ini");

    game.ini();
  }

  windup(game.speed);

  handleStartButton();
}

size("ini");

const game = new SnakeGame();

startBtn.addEventListener("click", gameStarter);




