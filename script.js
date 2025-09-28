const root = document.documentElement;
const html = document.querySelector("html");
const menu = document.querySelector(".menu");
const mainMenu = document.querySelector(".main-menu");
const startBtn = document.querySelector(".start-btn");
const settingsBtn = document.querySelector(".settings-btn");
const settingsMenu = document.querySelector(".settings-menu");
const background = document.querySelector(".background");
const container = document.querySelector(".container");
const border = document.querySelector(".border");
const snake = document.querySelector(".snake");
const score = document.querySelector(".score");
const record = document.querySelector(".record");

const size =  Math.floor(40 / 2) * 2;
const step = size / 2;
const stats = {score: 0, record: 0};
const containerWidth = normalize(container.clientWidth);
const containerHeight = normalize(container.clientHeight);


let borderWidth = containerWidth;
let borderdHeight = containerHeight;
let intervalId = null;
let borderCenter = {};
let timeUnit = 500;
let timeGap = timeUnit;


/* 
- settings (this.snakeBody color | size size | shrink(on/off) | controls (absolute/relative) | god mode)
- minmax size size
- give food dynamic color changes 
*/

// VISUALS
container.style.width = containerWidth + "px";
container.style.height = containerHeight + "px";

root.style.setProperty("--size", `${size}px`);
root.style.setProperty("--time-gap", `${timeGap / 1000}s`);

let clip = step; 

const mainColor = "hsl(120, 100%, 25%)";

function normalize(val) {
  return (Math.floor(val / step) * step);
}

function borderSize(mode) {
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
      borderWidth = border.clientWidth - size;
      borderHeight = border.clientHeight - size;
      border.style.width = borderWidth + "px";
      border.style.height = borderHeight + "px";
    }

  // clip background image
  clip += step;
  background.style.clipPath = `inset(${clip - 1}px)`;
}

function reset() {
  border.style.width = containerWidth;
  border.style.height = containerHeight;
  background.style.clipPath = "inset(0px)";
  clip = step;
  stats.score = 0;
  timeGap = 1000;
  document.querySelectorAll(".block").forEach((coord) => coord.remove())
  root.style.setProperty("--turn", "");
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
    this.snakeBody = [...document.querySelectorAll(".snake-body")];
    this.ini();
  }

  ini() {
    // parameters
    this.speed = 1;
    this.direction = {"x": 1, "y": 0};
    this.turn = 0;
    this.hsl = this._splitColor();

    // snake 
    createElement(borderCenter.x, borderCenter.y, this._changedColor({l: -2}), "snake-body", "head") ; 
    createElement(borderCenter.x - step ,borderCenter.y, mainColor, "snake-body", "neck"); 
    this.head = document.getElementById("head");
    this.neck = document.getElementById("neck");

    this.head.style.scale = `${1}`;
    this.neck.style.scale = `${0.75}`;

    // shrink 
    this.counterOuter = 1;
    this.counterInner = 0;

    this._createFood();
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

    this.head.style.rotate = `${this.turn}turn`;
  }

  _bodyFollows() {
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


  _repaintBody(ms=0) {
    return new Promise((resolve) => {
      let i;
      ms === 0 ? i = 1 : i = 0; // only go to head upon death
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
    const oldTail = this.snakeBody[this.snakeBody.length - 1];

    if (oldTail.id === "tail") oldTail.id = "";

    this.tail = oldTail.cloneNode(false);
    this.tail.id = "tail";
    this.tail.style.zIndex = `-${this.snakeBody.length}`
    snake.appendChild(this.tail);

    this._rescaleBody();;
    this._repaintTail();
  }

  _repaintTail() {
    const lighterColor = this._changedColor({l: this.snakeBody.length});
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
      console.log("i", i, "j", j, "scale:", scale);

      i--;
      j++;
      if (i > 0) rescaleSection();  
    }

    rescaleSection();
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
       [x, y] = [getRandomInt(clip, containerWidth - clip - size), getRandomInt(clip, containerHeight - clip - size)]; 
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

      this._lengthenSnake();

      this.speed++;

      timeGapUpdate();

      this._checkShrinkBorder();

      stats.score++;
      score.innerText = `Score: ${stats.score}`;

      clearInterval(intervalId);
      windup(); 
    }
  }

  _collision() {
    return (
      parseInt(this.head.style.left) < clip || parseInt(this.head.style.left) > containerWidth - (clip + size) // left & right border
      || parseInt(this.head.style.top) < clip || parseInt(this.head.style.top) > containerHeight - (clip + size) //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top)
      ) 
  }

  _coordsInsideBody(x, y) {
    if (typeof x === "number") [x, y] = [x + "px", y + "px"];
    //if ([...document.querySelectorAll(".snake-body")].some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))))  console.log("⚠ Head inside BODY!");
    return this.snakeBody.some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))); // head is excluded
  }

  _splitColor() {
    let hsl = mainColor.match(/\d+/g);
    hsl = hsl.map((val) => Number(val)); 
    return {h: hsl[0], s: hsl[1], l: hsl[2]};
  }

  _changedColor({h = 0, s = 0, l = 0} = {}) {
    return `hsl(${this.hsl.h + h}, ${this.hsl.s + s}%, ${this.hsl.l + l}%)`
  }

  
  _checkShrinkBorder() {
    this.counterInner++;
    if (this.counterInner >= this.counterOuter && !this._nearOppositeSides()) {
      this.counterInner = 0;
      this.counterOuter++;
      borderSize("shrink");
      this._borderShrinkOffset();
    }
  }
  
  _borderShrinkOffset() {
    this._snapshotSnake();

    // if snake inside top border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) <= clip + step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + step + "px" );
      console.log("snake inside top border")
    }

    // if snake inside bottom border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) >= containerHeight - clip - step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - step + "px" );
      console.log("snake inside bottom border")
    }

    // if snake inside left border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) <= clip + step))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + step + "px" );
      console.log("snake inside left border")
    }
    
    // if snake inside right border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) >= containerWidth - clip - step))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - step + "px" );
      console.log("snake inside right border")
    }


    // if food inside top border
    if (parseInt(this.food.style.top) <= clip) {
      this.food.style.top = parseInt(this.food.style.top) + size + "px";
    } 

    // if food inside bottom border
    if (parseInt(this.food.style.top) >= containerHeight - clip) {
      this.food.style.top = parseInt(this.food.style.top) - size + "px";
    } 

    // if food inside right border
    if (parseInt(this.food.style.left) >= containerWidth - clip) {
      this.food.style.left = parseInt(this.food.style.left) - size + "px";
    }

    // if food inside left border
    if (parseInt(this.food.style.left) < clip) {
      this.food.style.left = parseInt(this.food.style.left) + size + "px";
    }    

    this._ateFood(); // in case snake eats food during the offset process
  }

  _nearOppositeSides() {
    return ((this.snakeBodyData.some((coord) => (parseInt(coord.top) <= clip + step ) 
        && this.snakeBodyData.some((coord) => (parseInt(coord.top) >= containerHeight - clip - step * 2))))  // top - bottom
        || ((this.snakeBodyData.some((coord) => (parseInt(coord.left) <= clip + step)))) // left - right
           && (this.snakeBodyData.some((coord) => parseInt(coord.left) >= containerWidth - clip - step * 2)))
  }

  _gameOver() {
    clearInterval(intervalId);

    // "withdraw" yourscoordf from the point of collision
    this.head.style.left = `${parseInt(this.head.style.left) - this.direction.x * step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) - this.direction.y * step}px`;

    if (stats.score > stats.record) {
      stats.record = stats.score;
    }

    this.hsl.s *= 0.15;
    this._repaintBody(timeGap)
      .then(() => wait(1000))
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

function roundTo(value, decimals) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}


// controls 
const handleKeydown = (event) => {
  switch (event.key) {
    // prevent this.snakeBody from hitting borders up close
    case "ArrowUp":
      if (!(parseInt(game.neck.style.top) === clip && game.direction.y === 0 || game.direction.y == 1)) { // top border
        game.turn += -(0.25 * game.direction.x);

        game.direction.x = 0;
        game.direction.y = -1;

        html.removeEventListener("keydown", handleKeydown); // only one change per frame is allowed
      }
      break;

    case "ArrowRight":
      if (!(parseInt(game.neck.style.left) === containerWidth - clip - size && game.direction.x === 0 || game.direction.x == -1)) { // top border
        game.turn +=  -(0.25 * game.direction.y);

        game.direction.x = 1;
        game.direction.y = 0;

        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (!(parseInt(game.neck.style.top) === containerHeight - clip - size && game.direction.y === 0 || game.direction.y === -1)) { // bottom border
        game.turn +=  (0.25 * game.direction.x);

        game.direction.x = 0;
        game.direction.y = 1;

        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowLeft":
      if (!(parseInt(game.neck.style.left) === clip && game.direction.x === 0 || game.direction.x === 1)) {  // left border
        game.turn +=  (0.25 * game.direction.y);

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
  document.querySelectorAll("button").forEach((coord) => coord.style.display = "none");
}
 
function windup() {
  intervalId = setInterval(() => {
    controlOn();

    game.action();
  }, timeGap); 
}

const handleSettingsButton = () => {
  mainMenu.style.display = "none";
  settingsMenu.style.display = "flex"
}

async function gameStarter() {
  handleStartButton();

  if (intervalId > 1) { // for restart
    reset();

    await wait(1000);

    borderSize("ini");

    game.ini();
  }

  timeGapUpdate();

  windup();
}


borderSize("ini");

const game = new SnakeGame();

startBtn.addEventListener("click", gameStarter);

settingsBtn.addEventListener("click", handleSettingsButton);


