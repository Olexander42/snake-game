const root = document.documentElement;
const html = document.querySelector("html");
const menu = document.querySelector(".menu");
const start = document.querySelector(".start-btn");
const startAgain = document.querySelector(".start-again-btn");
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
- settings (snake color / step size / hard ))
- minmax size
- rewrite canvas in css
*/

// VISUALS
const step = 20;
root.style.setProperty("--step", `${step}px`);

let clip = step / 2; // clip-path value to use on background inside the walls

function size(mode) {
  // fetch sizes
  let containerWidth = parseInt(getComputedStyle(container).width); 
  let containerHeight = parseInt(getComputedStyle(container).height);

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

function resetSize() {
    container.style.width = "";
    container.style.height = "";
    background.style.clipPath = "none";
    clip = step / 2;
    stats.score = 0;
}

function createElement(x, y, color, id="") {
  const element  = document.createElement('div');

  element.classList.add("block");
  element.id = id;
  element.style.left = `${x * step}px`;
  element.style.top = `${y * step}px`;
  element.style.backgroundColor = color;

  container.appendChild(element);
}


// LOGIC 
class SnakeGame {
  constructor() {
    // create snake
    createElement(playgroundCenter.x, playgroundCenter.y, 'darkgreen', "head"); 
    createElement(playgroundCenter.x - 1, playgroundCenter.y, 'green', "tail"); 
    this.head = document.getElementById("head");
    this.tail = document.getElementById("tail");

    // parameters
    this.speed = 1;
    this.direction = {x: 1, y: 0};

    // colors
    /*
    this.snakeColor = "hsl(120, 100%, 25%)";
    this.hsl = this._splitColor();
    this.headColor = `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l * 0.75}%)`
    
    // shrink 
    this.counterOuter = 1;
    this.counterInner = 0;

    this._createSnake();
    this._drawSnake();
     */
    this._createFood();
  }

  move() {
    this._rememberHead();
    this.head.style.left = `${parseInt(this.head.style.left) + this.direction.x * step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) + this.direction.y * step}px`;
    if (!this._ateFood()) {
      this._deleteTail();
    } else {
      this.food.remove();
      this._createFood();
      stats.score++;
      this.speed++;
      clearInterval(intervalId);
      windup(this.speed);      
    }
  }

  // snake
  _rememberHead() {
    const neck = this.head.cloneNode(false);
    neck.id = "";
    neck.style.backgroundColor = "green";
    this.head.parentNode.insertBefore(neck, this.head.nextSibling);
  }

  _deleteTail() {
    const newTail = this.tail.previousElementSibling;
    newTail.id = "tail";
    this.tail.remove();
    this.tail = newTail;
  }

  // food 
  _createFood() { 
     const [x, y] = [getRandomInt(2, playgroundWidth - 1), getRandomInt(2, playgroundHeight - 1)]; 
     createElement(x, y, 'red', "food");
     this.food = document.getElementById("food");
    }

  // general 
  _ateFood() {
    if (this.food.style.left === this.head.style.left && this.food.style.top === this.head.style.top) {
      return true
    }
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
    case "ArrowUp":
      if (game.direction.y !== 1) {
        game.direction.x = 0;
        game.direction.y = -1;
        html.removeEventListener("keydown", handleKeydown); // only one change per frame is allowed
      }
      break;

    case "ArrowRight":
      if (game.direction.x !== -1) {
        game.direction.x = 1;
        game.direction.y = 0;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (game.direction.y !== -1) {
        game.direction.x = 0;
        game.direction.y = 1;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowLeft":
      if (game.direction.x !== 1) {
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
    game.move();
  }, 500 / speed); 
}

const gameStarter = (btn) => {
  btn.addEventListener("click", (event) => {
    resetSize();
    size("init");
    game = new SnakeGame();
    windup(game.speed);
    btn.style.display = "none";
    menu.style.display = "none";
  })
}

size("init");

gameStarter(start);

//gameStarter(startAgain);

