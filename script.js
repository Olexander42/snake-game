const html = document.querySelector("html");
const container = document.querySelector(".container")
const playground = document.querySelector(".playground");
const score = document.querySelector(".score");

const plgrndCtx = playground.getContext("2d");
const scrCtx = score.getContext("2d");
let points = 0;
let playgroundWidth;
let playgroundHeight;

/* 
- show best result (stats)
- test collisions
- test food coords (sometimes food doesn't appear - probably it appears in the same position or inside body)
- background image
- menu (start / stats / settings (snake color / block size))
- add in-ward spikes to border
- sound effects
*/
// VISUALS
const block = 20;

score.width = block * 7;
score.height = block;

function drawblock(x, y, type="square") {
  plgrndCtx.beginPath();
  if (type === "circle") {
    plgrndCtx.arc(x * block + block / 2, y * block + block / 2, block / 2, 0, 2 * Math.PI);
  } else {
    plgrndCtx.fillRect(x * block, y * block, block, block);
  }
  plgrndCtx.fill()
}

function drawOutline(mode="init") {
  // fetch sizes
  let containerWidth = parseInt(getComputedStyle(container).width); 
  let containerHeight = parseInt(getComputedStyle(container).height);
  if (mode === "init") {
    // round the size in pixels to the round number of blocks
    containerWidth = Math.round(containerWidth / 20) * 20 ;
    containerHeight = Math.round(containerHeight / 20) * 20;
    // apply the sizing 
    container.style.width = containerWidth + "px";
    container.style.height = containerHeight + "px";
  } else if (mode === "shrink") {
      container.style.width = containerWidth - block + "px";
      container.style.height = containerHeight - block + "px";
  }
  playground.width = container.clientWidth;
  playground.height = container.clientHeight;
  // convert pixels to blocks
  playgroundWidth = playground.width / block;
  playgroundHeight = playground.height / block;

  drawBorder();

  drawScore();

  drawSpike();
}

function drawBorder() {
  plgrndCtx.beginPath();
  plgrndCtx.strokeStyle = "#8B4513";
  plgrndCtx.lineWidth = block;
  plgrndCtx.moveTo(0, block/2);
  plgrndCtx.lineTo(playground.width - block/2, block/2);
  plgrndCtx.lineTo(playground.width - block/2, playground.height - block/2);
  plgrndCtx.lineTo(block/2, playground.height - block/2);
  plgrndCtx.lineTo(block/2, 0);
  plgrndCtx.stroke();
}

function drawScore(){
  scrCtx.clearRect(4 * block , 0, 5 * block, block);
  scrCtx.font = `${block}px Courier`;
  scrCtx.fillStyle = "white";
  scrCtx.textAlign = "left";
  scrCtx.textBaseline = "middle"; 
  scrCtx.fillText("Score: " + points, block/2, block/2);
}

function drawSpike() {
  plgrndCtx.beginPath();
  plgrndCtx.strokeStyle = "black";
  plgrndCtx.lineWidth = 2;
  plgrndCtx.moveTo(block, block);
  plgrndCtx.lineTo(block * 1.5, block * 2);
  plgrndCtx.lineTo(block * 2, block);
  plgrndCtx.stroke();
}

drawOutline(); // to fetch and initialize the sizing

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
    this._checkCollision();
    this._drawSnake();
    this._checkSnakeFood();
    console.log(this.xHead, this.yHead);
    if (this.length < this.body.length) this._deleteTail();
  }

  _drawSnake() {
    // head
    plgrndCtx.fillStyle = "darkgreen";
    drawblock(this.xHead, this.yHead);

    // body
    for (let i = 0; i < this.body.length; i++) {
      plgrndCtx.fillStyle = "green";
      drawblock(this.body[i][0], this.body[i][1]); // redraw head but in another color 
    }
  }

  _updateBody() {
    let xBody = this.xHead;
    let yBody = this.yHead;
    this.body.push([xBody, yBody]); // grow body by "remembering" head coords
  }


  _deleteTail() {
    let [xTail, yTail] = this.body.shift(); // get the last coords of body
    plgrndCtx.clearRect(xTail * block, yTail * block, block, block);
  }

  _grow() {
    points++;
    this.length++;
    this.speed++;
    drawScore();
    this._shrinkCount();
    this._drawSnake();
    this._initWindup(); 
  }

  _checkCollision() {
    if (
    this._coordInsideBody(this.xHead, this.yHead, this.body) ||
    this.xHead >= playgroundWidth - 1 ||
    this.xHead < 1 ||
    this.yHead >= playgroundHeight - 1 ||  
    this.yHead < 1
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
    drawblock(this.xFood, this.yFood, "circle");
  } 

  _getRandomFoodCoord() { 
    while (true) {
      let [x, y] = [
        getRandomInt(3, playgroundWidth - 3),
        getRandomInt(3, playground.height / block - 3)
        ]; 
      if (!this._coordInsideBody(x, y, this.body)) { 
          return [x, y];
        }
      }
    } 

  // general   
  _init() {
    this._clearplayground();
    this.xHead = Math.floor(playgroundWidth / 2);
    this.yHead = Math.floor(playgroundHeight / 2);
    this.xDirection = 1;
    this.yDirection = 0;
    this.speed = 1;
    this.body = [];
    this.length = 1;
    this.counterOuter = 1;
    this.counterInner = 0;
    points = 0;
    // reset the sizing 
    container.style.width = "";
    container.style.height = "";
    drawOutline();
    this._drawSnake();
    this._randomFoodCreation();
    this.move();
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

  _shrinkCount() {
    if (this.counterInner < this.counterOuter) {
      this.counterInner++;
      if (this.counterInner >= this.counterOuter) {
        drawOutline("shrink");
        this.counterInner = 0;
        this.counterOuter++;
      }
    }
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
