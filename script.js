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
- background image
- menu (start / stats / settings (snake color / block size))
- add in-ward spikes to border
- sound effects
- snake gradient color
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

function draw(mode="init") {
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

  drawSpikes();
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

function drawSpike(i=1, j=1, base, direction) {
  let x = block * i;
  let y = block * j;
  if (base === "horizontal") {
    plgrndCtx.beginPath();
    plgrndCtx.moveTo(x, y);
    direction === "down" 
      ? plgrndCtx.lineTo(x + block/2, y + block) 
      : plgrndCtx.lineTo(x + block/2, y - block);
    plgrndCtx.lineTo(x + block, y);
    plgrndCtx.fill();
  } else if (base === "vertical") {
      plgrndCtx.beginPath();
      plgrndCtx.moveTo(x, y);
      direction === "left" 
        ? plgrndCtx.lineTo(x - block, y + block/2) 
        : plgrndCtx.lineTo(x + block, y + block/2)
      plgrndCtx.lineTo(x, y + block);
      plgrndCtx.fill();
    }
}

function drawSpikes() {
  // width and height of inner border in blocks
  const hLength = playgroundWidth - 1; 
  const vLength = playgroundHeight - 1;
  // horizontal base
  for (let i = 1; i < hLength; i++) {
    drawSpike(i, 1, "horizontal", "down");
    drawSpike(i, vLength, "horizontal", "up");
  }
  // vertical base 
  for (let j = 2; j < vLength - 1; j++) {
    drawSpike(hLength, j, "vertical", "left");
    drawSpike(1, j, "vertical", "right");
  }
}

draw(); // to fetch and initialize the sizing

// LOGIC 
class SnakeGame {
  constructor() {
    this._init();
  }

  // snake
  move() {
    this._updateTail();
    this.xHead += this.xDirection ;
    this.yHead += this.yDirection;
    this._checkCollision();
    this._checkSnakeFood();
    //console.log(this.xHead, this.yHead)
    if (this.length < this.tail.length) this._deleteTail();
    this._drawSnake();
  }

  _drawSnake() {
    // head
    plgrndCtx.fillStyle = "darkgreen";
    drawblock(this.xHead, this.yHead);
    // tail
    for (let i = 0; i < this.tail.length; i++) {
      plgrndCtx.fillStyle = "green";
      drawblock(this.tail[i][0], this.tail[i][1]);
    }
  }

  _updateTail() {
    let xTail = this.xHead;
    let yTail = this.yHead;
    this.tail.push([xTail, yTail]); // grow tail by "remembering" head coords
  }


  _deleteTail() {
    let [xTail, yTail] = this.tail.shift(); // get the last coords of tail
    plgrndCtx.clearRect(xTail * block, yTail * block, block, block);
  }

  _grow() {
    points++;
    this.length++;
    this.speed++;
    draw();
    this._shrinkCount();
    this._initWindup();
    this._drawSnake(); 
  }

  _checkCollision() {
    if (
    this._coordInsideTail(this.xHead, this.yHead) ||
    this.xHead >= playgroundWidth - 2 ||
    this.xHead < 2 ||
    this.yHead >= playgroundHeight - 2 ||  
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
    drawblock(this.xFood, this.yFood, "circle");
  } 

  _getRandomFoodCoord() { 
    while (true) {
      let [x, y] = [
        getRandomInt(2, playgroundWidth - 2), 
        getRandomInt(2, playgroundHeight - 2)
        ]; 
      if (this._coordInsideTail(x, y) || x === this.xFood || y === this.yFood) {
          continue;
        } else {
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
    this.tail = [];
    this.length = 1;
    this.counterOuter = 1;
    this.counterInner = 0;
    points = 0;
    // reset the sizing 
    container.style.width = "";
    container.style.height = "";

    draw();
    this._randomFoodCreation();
    this.move(); // to create tail upon creation
    this._drawSnake();
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

  _coordInsideTail(x, y) {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.tail[i][0] === x && this.tail[i][1] === y) {
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
        draw("shrink");
        this.counterInner = 0;
        this.counterOuter++;
      }
    }
  }
  
  /*
  _snakeCoordsCorrection() {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.tail[i][0] === (playgroundWidth - 2) { // if snake inside right border spikes

      }

       this.tail[i][1] === (playgroundHeight - 2)) 
  }
  */
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
  }, 100000000 / 1); 
}

windup(snake.speed);
