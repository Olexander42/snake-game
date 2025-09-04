const body = document.querySelector("body");
const playground = document.querySelector(".playground");
const ctx = playground.getContext("2d");
const score = document.querySelector(".score");
const scrCtx = score.getContext("2d");

const block = playground.width / 50;
const border = 2 * block;

function drawBlock(x, y, type="square") {
  ctx.beginPath();
  if (type === "circle") {
    ctx.arc(x * block + block / 2, y * block + block / 2, block / 2, 0, 2 * Math.PI);
  } else {
    ctx.fillRect(x * block, y * block, block, block);
  }
  ctx.fill()
}

function drawBorder() {
  ctx.beginPath();
  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 2 * border;
  ctx.moveTo(0, 0);
  ctx.lineTo(playground.width, 0);
  ctx.lineTo(playground.width, playground.height);
  ctx.lineTo(0, playground.height);
  ctx.lineTo(0, 0);
  ctx.stroke();
}

class SnakeGame {
  constructor() {
    this._init();
  }

  // snake
  move() {
    this._updateBody();
    this.xHead += this.xDirection ;
    this.yHead += this.yDirection;
    this._checkCollision();
    this._drawSnake();
    this._checkSnakeFood();
    if (this.length < this.body.length) this._deleteTail();
  }

  _drawSnake() {
    // head
    ctx.fillStyle = "darkgreen";
    drawBlock(this.xHead, this.yHead);

    // body
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillStyle = "green";
      drawBlock(this.body[i][0], this.body[i][1]);
    }
  }

  _updateBody() {
    let xBody = this.xHead;
    let yBody = this.yHead;
    this.body.push([xBody, yBody]);
  }


  _deleteTail() {
    let [xTail, yTail] = this.body.shift();
    ctx.clearRect(xTail * block, yTail * block, block, block);
  }

  _grow() {
    this.length += 1;
    this.speed += 1;
    this.score++;
    this._initWindup();
    this._displayScore();
  }

  _checkCollision() {
    if (
    this._coordInsideBody(this.xHead, this.yHead, this.body) ||
    this.xHead > playground.width / block - 3 ||
    this.xHead < 2 ||
    this.yHead > playground.height / block - 3 ||  
    this.yHead < 2
    ) {
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
    ctx.fillStyle = "red";
    drawBlock(this.xFood, this.yFood, "circle");
  } 

  _getRandomFoodCoord() { 
    while (true) {
      let [x, y] = [getRandomInt(3, playground.width / block - 3), getRandomInt(3, playground.height / block - 3)];
      if (!this._coordInsideBody(x, y, this.body)) { 
          return [x, y];
        }
      }
    } 

  // score
  _displayScore() {
    scrCtx.clearRect(4 * block , block / 2, 2 * block, block);
    scrCtx.font = "20px Courier";
    scrCtx.fillStyle = "black";
    scrCtx.textAlign = "left";
    scrCtx.textBaseline = "top";
    scrCtx.fillText("Score: " + this.score, block / 2, block / 2);
  }

  // general   

  _init() {
    this._clearplayground();
    this.xHead = Math.floor(playground.width / block / 2);
    this.yHead = Math.floor(playground.height / block / 2);
    this.xDirection = 1;
    this.yDirection = 0;
    this.speed = 1;
    this.body = [];
    this.length = 1;
    this.score = 0;
    this._drawSnake();
    this._randomFoodCreation();
    drawBorder();
    this._displayScore(); 
    this.move();
  }
   
  _checkSnakeFood() {
    if (this.xHead === this.xFood && this.yHead === this.yFood) {
      this._grow();
      this._randomFoodCreation();
    }
  }

  _initWindup() {
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
  ctx.clearRect(0, 0, playground.width, playground.height);
  }
}

function getRandomInt(min, max) {
    const result = Math.floor(Math.random() * ((max - min)) + min);
    return result;
  }

// controls 
body.addEventListener("keydown", (event) => {
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

// game engine
const snake = new SnakeGame();

let intervalId;
function windup(speed) {
  intervalId = setInterval( () => {
    snake.move();
  }, 1000 / speed);
}

windup(snake.speed);