const html = document.querySelector("html");
const container = document.querySelector(".container")
const border = document.querySelector(".border");
const playground = document.querySelector(".playground");
const score = document.querySelector(".score");

const brdrCtx = border.getContext("2d");
const plgrndCtx = playground.getContext("2d");
const scrCtx = score.getContext("2d");
const pixel = 20;
const borderThick = pixel * 2;
const k = 0.9;
let points;

// visuals
playground.width = container.clientWidth;
playground.height = container.clientHeight;

border.width = container.clientWidth;
border.height = container.clientHeight;

playgroundWidthPx = Math.floor(playground.width / pixel);
playgroundHeightPx = Math.floor(playground.width / pixel);

borderWidthPx = Math.floor(border.width / pixel);
borderHeightPx = Math.floor(border.height / pixel);

score.width = pixel * 10;
score.height = pixel * 2;

function drawPixel(x, y, type="square") {
  plgrndCtx.beginPath();
  if (type === "circle") {
    plgrndCtx.arc(x * pixel + pixel / 2, y * pixel + pixel / 2, pixel / 2, 0, 2 * Math.PI);
  } else {
    plgrndCtx.fillRect(x * pixel, y * pixel, pixel, pixel);
  }
  plgrndCtx.fill()
}

function drawBorder() {
  brdrCtx.beginPath();
  brdrCtx.strokeStyle = "#8B4513";
  brdrCtx.lineWidth = borderThick * 2;
  brdrCtx.moveTo(0, 0);
  brdrCtx.lineTo(border.width, 0);
  brdrCtx.lineTo(border.width, border.height);
  brdrCtx.lineTo(0, border.height);
  brdrCtx.lineTo(0, 0);
  brdrCtx.stroke();
}

function displayScore() {
  scrCtx.clearRect(4 * pixel , pixel / 2, 2 * pixel, pixel);
  scrCtx.font = `${pixel}px Courier`;
  scrCtx.fillStyle = "black";
  scrCtx.textAlign = "left";
  scrCtx.textBaseline = "top";
  scrCtx.fillText("Score: " + points, pixel / 2, pixel / 2);
}

function shrink() {
  border.width *= 0.9;
  border.height *= 0.9;

  playground.width *= 0.9;
  playground.height *= 0.9;

  playgroundWidthPx = Math.floor(playground.width / pixel);
  playgroundHeightPx = Math.floor(playground.width / pixel);

  borderWidthPx = Math.floor(border.width / pixel);
  borderHeightPx = Math.floor(border.height / pixel);
}


// logic 

class SnakeGame {
  constructor() {
    this._init();
  }

  // snake
  move() {
    this._updateBody();
    this.xHead += this.xDirection ;
    this.yHead += this.yDirection;
    //this._checkCollision();
    this._drawSnake();
    this._checkSnakeFood();
    console.log(this.yHead, borderHeightPx);
    if (this.length < this.body.length) this._deleteTail();
  }

  _drawSnake() {
    // head
    plgrndCtx.fillStyle = "darkgreen";
    drawPixel(this.xHead, this.yHead);

    // body
    for (let i = 0; i < this.body.length; i++) {
      plgrndCtx.fillStyle = "green";
      drawPixel(this.body[i][0], this.body[i][1]); // redraw head but in another color 
    }
  }

  _updateBody() {
    let xBody = this.xHead;
    let yBody = this.yHead;
    this.body.push([xBody, yBody]); // grow body by "remembering" head coords
  }


  _deleteTail() {
    let [xTail, yTail] = this.body.shift(); // get the last coords of body
    plgrndCtx.clearRect(xTail * pixel, yTail * pixel, pixel, pixel);
  }

  _grow() {
    this.length += 1;
    this.speed += 1;
    points++;
    shrink();
    drawBorder();
    displayScore();
    this._initWindup(); 
  }

  _checkCollision() {
    if (
    this._coordInsideBody(this.xHead, this.yHead, this.body) ||
    this.xHead > borderWidthPx - 2 ||
    this.xHead < 2 ||
    this.yHead > borderHeightPx - 3 ||  
    this.yHead < 2
    ) {
      /* reset the game */
      this._init(); 
      this._initWindup() 
    }

  }

  // food
  _randomFoodCreation() {
    [this.xFood, this.yFood] = this._getRandomFoodCoord();
    this._drawFood();
  }

  _drawFood() {
    plgrndCtx.fillStyle = "red";
    drawPixel(this.xFood, this.yFood, "circle");
  } 

  _getRandomFoodCoord() { 
    while (true) {
      let [x, y] = [
        getRandomInt(3, borderWidthPx - 3),
        getRandomInt(3, borderHeightPx - 3)
        ]; 
      if (!this._coordInsideBody(x, y, this.body)) { 
          return [x, y];
        }
      }
    } 

  // general   
  _init() {
    this._clearplayground();
    this.xHead = Math.floor(playgroundWidthPx / 2);
    this.yHead = Math.floor(playgroundHeightPx / 2);
    this.xDirection = 1;
    this.yDirection = 0;
    this.speed = 1;
    this.body = [];
    this.length = 1;
    points = 0;
    this._drawSnake();
    this._randomFoodCreation();
    this.move();
    drawBorder();
    displayScore(); 
  }
   
  _checkSnakeFood() {
    if (this.xHead === this.xFood && this.yHead === this.yFood) {
      this._grow();
      this._randomFoodCreation();
    }
  }

  _initWindup() { // change the speed by replacing setInterval()
    clearInterval(intervalId); 
    windup(this.speed);
  }

  _coordInsideBody(x, y, array) {
    for (let i = 0; i < this.body.length; i++) {
      if (this.body[i][0] === x && this.body[i][1] === y) {
        return true;
      }
    }
    return false;
  }

  _clearplayground() {
  plgrndCtx.clearRect(0, 0, playground.width, playground.height);
  }
}

function getRandomInt(min, max) {
    const result = Math.floor(Math.random() * ((max - min)) + min);
    return result;
  }

// controls 
html.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (snake.yDirection !== 1) {
        snake.xDirection = 0;
        snake.yDirection = -1;
        snake.move();
      }
      break;

    case "ArrowRight":
      if (snake.xDirection !== -1) {
        snake.xDirection = 1;
        snake.yDirection = 0;
        snake.move();
      }
      break;

    case "ArrowDown":
      if (snake.yDirection !== -1) {
        snake.xDirection = 0;
        snake.yDirection = 1;
        snake.move();
      }
      break;

    case "ArrowLeft":
      if (snake.xDirection !== 1) {
        snake.xDirection = -1;
        snake.yDirection = 0;
        snake.move();
      }
      break;
  }
})

// start the game 
const snake = new SnakeGame();

let intervalId;
function windup(speed) {
  intervalId = setInterval( () => {
    snake.move();
    console.log(snake.xHead, borderWidthPx);
  }, 50000 / 1); 
}

windup(snake.speed);
