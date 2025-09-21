const root = document.documentElement;
const html = document.querySelector("html");
const menu = document.querySelector(".menu");
const startBtn = document.querySelector(".start-btn");
const startAgainBtn = document.querySelector(".start-again-btn");
const background = document.querySelector(".background");
const container = document.querySelector(".container");
const score = document.querySelector(".score");
const record = document.querySelector(".record");

let playgroundWidth = null;
let playgroundHeight = null;
let game = null;
let intervalId = null;
let playgroundCenter = {};
const stats = {score: 0, record: 0};

/* 
- settings (snake color | step size | shrink(on/off) | controls (absolute/relative) | (css/canvas)))
- minmax size
*/

// VISUALS
const step = 20;
root.style.setProperty("--step", `${step}px`);

let clip = step / 2; // clip-path value to use on background inside the walls

const mainColor = "hsl(120, 100%, 25%)";

function size(mode) {
  // fetch sizes
  containerWidth = parseInt(getComputedStyle(container).width); 
  containerHeight = parseInt(getComputedStyle(container).height);

  if (mode === "init") {
     // "normalization"
    containerWidth = Math.round(containerWidth / step) * step;
    containerHeight = Math.round(containerHeight / step) * step;

    // apply the sizing 
    container.style.width = containerWidth + "px";
    container.style.height = containerHeight + "px";
    background.style.width = containerWidth + "px";
    background.style.height = containerHeight + "px";

    score.innerText = `Score: ${stats.score}`;
    record.innerText = `Record: ${stats.record}`;

  } else if (mode === "shrink") {
      // shrink container
      container.style.width = containerWidth - step + "px";
      container.style.height = containerHeight - step + "px";
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

  container.appendChild(element);
}


// LOGIC 
class SnakeGame {
  constructor() {
    // parameters
    this.speed = 1;
    this.direction = {x: 1, y: 0};

    // create snake
    this.hsl = this._splitColor();
    createElement(playgroundCenter.x, playgroundCenter.y, this._changedColor({l: (-2)}), "head", "head") ; 
    createElement(playgroundCenter.x - 1, playgroundCenter.y, this._changedColor(), "snake-body", "tail"); 
    this.head = document.getElementById("head");
    this.tail = document.getElementById("tail");

    
    // shrink 
    this.counterOuter = 1;
    this.counterInner = 0;

    this._createFood();
  }

  action() {
    this._rememberHead();
    this._move();
    if (this._collision()) this._gameOver();
    else {
      if (!this._ateFood()) this._deleteTail();
      this._repaintBody();
    }
  }

  // snake
  _move() {
    this.head.style.left = `${parseInt(this.head.style.left) + this.direction.x * step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) + this.direction.y * step}px`;
  }

  _rememberHead() {
    this.neck = this.head.cloneNode(false);
    this.neck.id = "";
    this.neck.classList.remove("head");
    this.neck.classList.add("snake-body");
    //this.neck.style.backgroundColor = "green";
    this.head.parentNode.insertBefore(this.neck, this.head.nextSibling);
  }

  _deleteTail() {
    const newTail = this.tail.previousElementSibling;
    newTail.id = "tail";
    this.tail.remove();
    this.tail = newTail;
  }

  _repaintBody(ms=0) {
    return new Promise((resolve) => {
      const snakeSections = document.querySelectorAll(".snake-body");
      let i = 0;

      this.head.style.backgroundColor = this._changedColor({l: (-2)});
      console.log(this.headColor);
      const repaintSection = () => {
        setTimeout(() => {
          const lighterColor = this._changedColor({l: i});
          const s = snakeSections[i];
          s.style.backgroundColor = lighterColor;
          i++;
          if (i < snakeSections.length) {
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
    let [x, y] = [null, null]

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
      this._checkShrink();
      this._createFood();

      stats.score++;
      this.speed++;
      score.innerText = `Score: ${stats.score}`;

      clearInterval(intervalId);
      windup(this.speed); 

      return true;
    }
  }

  _collision() {
    if (
      parseInt(this.head.style.left) < step || parseInt(this.head.style.left) > container.clientWidth - step * 2 // left & right border
      || parseInt(this.head.style.top) < step || parseInt(this.head.style.top) > container.clientHeight - step * 2 //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top, "head")
      ) return true
  }

  _coordsInsideBody(x, y, obj) {
    if (obj === "food") {
      x *= step;
      y *= step;
      x = x + "px";
      y = y + "px";
    } 
    return [...document.querySelectorAll(".snake-body")].some((el) => (x === el.style.left && y === el.style.top));
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
        this._snakeShrinkCorrection();
      }
    }
  }
  
   _snakeShrinkCorrection() {
    // snake is inside right border after "shrink"
    if ([...document.querySelectorAll(".block")].some((el) => (parseInt(el.style.left) === container.clientWidth - step))) {
      document.querySelectorAll(".block").forEach((el) => el.style.left = parseInt(el.style.left) - step + "px" );
    }
    // snake is inside bottom border after "shrink"
    if ([...document.querySelectorAll(".block")].some((el) => (parseInt(el.style.top) === container.clientHeight - step))) {
      document.querySelectorAll(".block").forEach((el) => el.style.top = parseInt(el.style.top) - step + "px" );
    }
  }


  _gameOver() {
    clearInterval(intervalId);

    // "withdraw" yourself from the point of collision
    this.head.style.left = `${parseInt(this.head.style.left) - this.direction.x * step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) - this.direction.y * step}px`;
    this.neck.remove();

    if (stats.score > stats.record) {
      stats.record = stats.score;
    }

    this.hsl.s *= 0.2;
    this._repaintBody(250 / this.speed)
      .then(() => wait(250 / this.speed))
      .then(() => startAgainBtn.style.display = "block");
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
    // prevent snake from hitting borders up close
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


const control = () => {
  html.addEventListener("keydown", handleKeydown);
}
 
function windup(speed) {
  intervalId = setInterval(() => {
    control();
    game.action();
  }, 500 / speed); 
}

const gameStarter = (btn) => {
  btn.addEventListener("click", (event) => {
    reset();
    size("init");
    game = new SnakeGame();
    windup(game.speed);
    menu.style.display = "none";
    startAgainBtn.style.display = "none";
  })
}

size("init");

gameStarter(startBtn);

gameStarter(startAgainBtn);




