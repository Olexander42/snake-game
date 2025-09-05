const html = document.querySelector("html");
const container = document.querySelector(".container")
const playground = document.querySelector(".playground");
const score = document.querySelector(".score");

const plgrndCtx = playground.getContext("2d");
const scrCtx = score.getContext("2d");
let points;

/* 
- make the shrinking less aggressive
- show level (aka speed)
- show best result (stats)
- test collisions
- test food coords (sometimes food doesn't appear)
- background image
- menu (start / stats / settings (snake color / pixel size))
- add in-ward spikes to border
*/
// VISUALS
const pixel = 20;

// size dictated by CSS
containerWidth = parseInt(getComputedStyle(container).width); 
containerHeight = parseInt(getComputedStyle(container).height);

// round the size to the round number of in-game pixels
containerWidth = Math.round(containerWidth / 20) * 20 ;
containerHeight = Math.round(containerHeight / 20) * 20;

// apply the sizing 
container.style.width = containerWidth + "px";
container.style.height = containerHeight + "px";
playground.width = containerWidth;
playground.height = containerHeight;

// size in in-game pixels
playgroundWidthPx = playground.width / pixel;
playgroundHeightPx = playground.width / pixel;

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
  plgrndCtx.lineWidth = pixel;
  plgrndCtx.moveTo(0, pixel/2);
  plgrndCtx.lineTo(playground.width - pixel/2, pixel/2);
  plgrndCtx.lineTo(playground.width - pixel/2, playground.height - pixel/2);
  plgrndCtx.lineTo(pixel/2, playground.height - pixel/2);
  plgrndCtx.lineTo(pixel/2, 0);
  plgrndCtx.stroke();
}

score.width = pixel * 10;
score.height = pixel;
function displayScore() {
  scrCtx.clearRect(4 * pixel , 0, 5 * pixel, pixel);
  scrCtx.font = `${pixel}px Courier`;
  scrCtx.fillStyle = "white";
  scrCtx.textAlign = "top";
  scrCtx.textBaseline = "middle";
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

// LOGIC 
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
    points += this.speed; // later points are move valuable
    this.length += 1;
    this.speed += 1;
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
