const html = document.querySelector("html");
const container = document.querySelector(".container")
const playground = document.querySelector(".playground");
const score = document.querySelector(".score");

const plgrndCtx = playground.getContext("2d");
const scrCtx = score.getContext("2d");
let points;
const pixel = 20;
const border = pixel * 2;

// visuals
playground.width = container.clientWidth;
playground.height = container.clientHeight;

playgroundWidthPx = Math.floor(playground.width / pixel);
playgroundHeightPx = Math.floor(playground.width / pixel);

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
  plgrndCtx.beginPath();
  plgrndCtx.strokeStyle = "#8B4513";
  plgrndCtx.lineWidth = 2 * border;
  plgrndCtx.moveTo(0, 0);
  plgrndCtx.lineTo(playground.width, 0);
  plgrndCtx.lineTo(playground.width, playground.height);
  plgrndCtx.lineTo(0, playground.height);
  plgrndCtx.lineTo(0, 0);
  plgrndCtx.stroke();
}


function displayScore() {
  scrCtx.clearRect(4 * pixel , pixel / 2, 2 * pixel, pixel);
  scrCtx.font = `${pixel}px Courier`;
  scrCtx.fillStyle = "white";
  scrCtx.textAlign = "left";
  scrCtx.textBaseline = "top";
  scrCtx.fillText("Score: " + points, pixel / 2, pixel / 2);
}

function shrink() {
  container.style.width = parseInt(getComputedStyle(container).width) - pixel + "px";
  container.style.height = parseInt(getComputedStyle(container).height) - pixel + "px";
  playground.width = container.clientWidth;
  playground.height = container.clientHeight;
  playgroundWidthPx = Math.floor(playground.width / pixel);
  playgroundHeightPx = Math.floor(playground.width / pixel);
  console.log("shrink()");
  drawBorder();
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
    console.log(this.xHead, playgroundWidthPx );
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
    displayScore();
    this._drawSnake();
    this._initWindup(); 
    
  }

  _checkCollision() {
    if (
    this._coordInsideBody(this.xHead, this.yHead, this.body) ||
    this.xHead > playgroundWidthPx - 3 ||
    this.xHead < 2 ||
    this.yHead > playground.height / pixel - 3 ||  
    this.yHead < 2
    ) {
      // reset the game 
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
        getRandomInt(3, playgroundWidthPx - 3),
        getRandomInt(3, playground.height / pixel - 3)
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
    this.yHead = Math.floor(playground.height / pixel / 2);
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
  }, 100000 / speed); 
}

windup(snake.speed);
