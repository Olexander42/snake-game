import { normalize, getRandomInt, wait, roundTo, splitColor, changedColor } from './helpers.js';

import { root, html, backgroundEl, containerEl, borderEl, snakeDiv, scoreEl, recordEl, buttons } from './elements.js';

import { sizes, stats, container, border, borderCenter, time } from './variables.js';

let game = null; // ⚠

buttons.size.addEventListener('input', () => {
  reset();
  sizes.width = Math.floor(buttons.size.value / 2) * 2;
  sizes.step = sizes.width / 2;
  root.style.setProperty("--sizes.width", `${sizes.width}px`);
  borderSize("ini");
  game = new SnakeGame();
})



/* 
- slider (progress / animation)
- settings  
- give food dynamic color changes 
*/

// VISUALS
containerEl.style.width = container.width + "px";
containerEl.style.height = container.height + "px";

root.style.setProperty("--size", `${sizes.width}px`);
root.style.setProperty("--time-gap", `${time.gap / 1000}s`);

const mainColor = ("hsl(120, 100%, 25%)");
const hslMain = splitColor(mainColor);

function borderSize(mode) {
  if (mode === "ini") {
     // initialization
    border.width = container.width; 
    border.height = container.height;

    borderEl.style.width = border.width + "px";
    borderEl.style.height = border.height + "px";
    backgroundEl.style.width = border.width + "px";
    backgroundEl.style.height = border.height + "px";

    borderCenter.x = normalize(Math.round(border.width / 2), sizes.step);
    borderCenter.y = normalize(Math.round(border.height / 2), sizes.step);

    scoreEl.innerText = `Score: ${stats.score}`;
    recordEl.innerText = `Record: ${stats.record}`;

  } else if (mode === "shrink") {
      // shrink border
      border.width = borderEl.clientWidth - sizes.width;
      border.height = borderEl.clientHeight - sizes.width;
      borderEl.style.width = border.width + "px";
      borderEl.style.height = border.height + "px";

       // sizes.clip background image
      sizes.clip += sizes.step;
      backgroundEl.style.clipPath = `inset(${sizes.clip - 1}px)`;
    }
}

function reset() {
  borderEl.style.width = container.width;
  borderEl.style.height = container.height;
  backgroundEl.style.clipPath = "";
  sizes.clip = sizes.width;
  stats.score = 0;
  time.gap = 1000;
  document.querySelectorAll(".block").forEach((el) => el.remove())
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

  if (className !== "food") snakeDiv.appendChild(element);
  else containerEl.appendChild(element);
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

    // snake 
    createElement(borderCenter.x, borderCenter.y, changedColor(hslMain , {l: -2}), "snake-body", "head") ; 
    createElement(borderCenter.x - sizes.step ,borderCenter.y, mainColor, "snake-body", "neck"); 
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
    this.head.style.left = `${parseInt(this.head.style.left) + this.direction.x * sizes.step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) + this.direction.y * sizes.step}px`;

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
          const lighterColor = changedColor(hslMain , {l: i});
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
    snakeDiv.appendChild(this.tail);

    this._rescaleBody();;
    this._repaintTail();
  }

  _repaintTail() {
    const lighterColor = changedColor(hslMain , {l: this.snakeBody.length});
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
       [x, y] = [getRandomInt(sizes.clip + sizes.step, container.width - sizes.clip - sizes.step * 2), getRandomInt(sizes.clip + sizes.step, container.height - sizes.clip - sizes.step * 2)]; 
       [x, y] = [normalize(x, sizes.step), normalize(y, sizes.step)];
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
      scoreEl.innerText = `Score: ${stats.score}`;

      clearInterval(intervalId);
      windup(); 
    }
  }

  _collision() {
    return (
      parseInt(this.head.style.left) < sizes.clip || parseInt(this.head.style.left) > container.width - (sizes.clip + sizes.width) // left & right border
      || parseInt(this.head.style.top) < sizes.clip || parseInt(this.head.style.top) > container.height - (sizes.clip + sizes.width) //top & bottom border
      || this._coordsInsideBody(this.head.style.left, this.head.style.top)
      ) 
  }

  _coordsInsideBody(x, y) {
    if (typeof x === "number") [x, y] = [x + "px", y + "px"];
    //if ([...document.querySelectorAll(".snake-body")].some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))))  console.log("⚠ Head inside BODY!");
    return this.snakeBody.some((coord, i) => (i !== 0 && (x === coord.style.left && y === coord.style.top))); // head is excluded
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
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) < sizes.clip + sizes.step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) + sizes.step + "px" );
      console.log("snake inside top border")
    }

    // if snake inside bottom border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.top) > container.height - sizes.clip - sizes.step))) {
      this.snakeBody.forEach((el) => el.style.top = parseInt(el.style.top) - sizes.step + "px" );
      console.log("snake inside bottom border")
    }

    // if snake inside left border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) < sizes.clip + sizes.step))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) + sizes.step + "px" );
      console.log("snake inside left border")
    }
    
    // if snake inside right border
    if (this.snakeBodyData.some((coord) => (parseInt(coord.left) > container.width - sizes.clip - sizes.width))) {
      this.snakeBody.forEach((el) => el.style.left = parseInt(el.style.left) - sizes.step + "px" );
      console.log("snake inside right border")
    }


    // if food inside top border
    if (parseInt(this.food.style.top) <= sizes.clip) {
      this.food.style.top = parseInt(this.food.style.top) + sizes.width + "px";
    } 

    // if food inside bottom border
    if (parseInt(this.food.style.top) >= container.height - sizes.clip) {
      this.food.style.top = parseInt(this.food.style.top) - sizes.width + "px";
    } 

    // if food inside right border
    if (parseInt(this.food.style.left) >= container.width - sizes.clip) {
      this.food.style.left = parseInt(this.food.style.left) - sizes.width + "px";
    }

    // if food inside left border
    if (parseInt(this.food.style.left) < sizes.clip) {
      this.food.style.left = parseInt(this.food.style.left) + sizes.width + "px";
    }    

    this._ateFood(); // in case snake eats food during the offset process
  }

  _nearOppositeSides() {
    return ((this.snakeBodyData.some((coord) => (parseInt(coord.top) <= sizes.clip + sizes.step ) 
        && this.snakeBodyData.some((coord) => (parseInt(coord.top) >= container.height - sizes.clip - sizes.step * 2))))  // top - bottom
        || ((this.snakeBodyData.some((coord) => (parseInt(coord.left) <= sizes.clip + sizes.step)))) // left - right
           && (this.snakeBodyData.some((coord) => parseInt(coord.left) >= container.width - sizes.clip - sizes.step * 2)))
  }

  _gameOver() {
    clearInterval(intervalId);

    // "withdraw" snake from the point of collision
    this.head.style.left = `${parseInt(this.head.style.left) - this.direction.x * sizes.step}px`;
    this.head.style.top = `${parseInt(this.head.style.top) - this.direction.y * sizes.step}px`;

    if (stats.score > stats.record) {
      stats.record = stats.score;
    }

    hslMain .s *= 0.15;
    this._repaintBody(time.gap)
      .then(() => wait(1000))
      .then(() => buttons.start.style.display = "block");
  }
}

function timeGapUpdate() {
  time.gap = Math.round(time.unit / game.speed);
  root.style.setProperty("--time-gap", `${time.gap / 1000}s`);
}

// controls 
let intervalId = 0; // ⚠ for debugging use only
const handleKeydown = (event) => {
  switch (event.key) {
    // prevent this.snakeBody from hitting borders up close
    case "ArrowUp":
      if (!(parseInt(game.head.style.top) === sizes.clip && game.direction.y === 0 || game.direction.y === 1)) { // top border
        game.turn += -(0.25 * game.direction.x);

        game.direction.x = 0;
        game.direction.y = -1;

        html.removeEventListener("keydown", handleKeydown); // only one change per frame is allowed
      }
      break;

    case "ArrowRight":
      if (!(parseInt(game.head.style.left) === container.width - sizes.clip - sizes.width && game.direction.x === 0 || game.direction.x == -1)) { // top border
        game.turn +=  -(0.25 * game.direction.y);

        game.direction.x = 1;
        game.direction.y = 0;

        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (!(parseInt(game.head.style.top) === container.height - sizes.clip - sizes.width && game.direction.y === 0 || game.direction.y === -1)) { // bottom border
        game.turn +=  (0.25 * game.direction.x);

        game.direction.x = 0;
        game.direction.y = 1;

        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowLeft":
      if (!(parseInt(game.head.style.left) === sizes.clip && game.direction.x === 0 || game.direction.x === 1)) {  // left border
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
        windup(time.gap);
      }
      break;
  }
}


const controlOn = () => {
  html.addEventListener("keydown", handleKeydown);
}

const handleStartButton = () => {
  buttons.start.innerText = "Start Again";
  document.querySelectorAll("button").forEach((coord) => coord.style.display = "none");
}
 
function windup() {
  intervalId = setInterval(() => {
    controlOn();

    game.action();
  }, time.gap); 
}

const handleSettingsButton = () => {
  mainMenu.style.display = "none";
  settingsMenu.style.display = "flex"
}

async function gameStarter() {
  document.querySelectorAll(".block").forEach((el) => el.remove())
  handleStartButton();

  if (intervalId > 1) { // for restart
    reset();

    await wait(1000);

    borderSize("ini");
  }

  game = new SnakeGame();

  timeGapUpdate();

  windup();
}

buttons.size.dispatchEvent(new Event('input'));

buttons.start.addEventListener("click", gameStarter);

buttons.settings.addEventListener("click", handleSettingsButton);




