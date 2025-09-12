const html = document.querySelector("html");
const menu = document.querySelector(".menu");
const start = document.querySelector(".start-btn");
const startAgain = document.querySelector(".start-again-btn");
const background = document.querySelector(".background");
const container = document.querySelector(".container");
const playground = document.querySelector(".playground");
const score = document.querySelector(".score");
const record = document.querySelector(".record");

const plgrndCtx = playground.getContext("2d");
const scrCtx = score.getContext("2d");
const rcrdCtx = record.getContext("2d");
let points = 0;
let best = 0;
let playgroundWidth;
let playgroundHeight;
let intervalId;

/* 
- menu (start / stats / settings (snake color / block size))
- snake gradient color
- restraing control
- border image (bricks)
*/

// VISUALS
const block = 20;
let clip = block/2; // clip-path value to use on background

[score, record].forEach((el) => {
  el.width = block * 7;
  el.height = block;
})

function drawblock(x, y, type="square") {
  plgrndCtx.beginPath();
  if (type === "circle") {
    plgrndCtx.arc(x * block + block / 2, y * block + block / 2, block / 2, 0, 2 * Math.PI);
  } else {
    plgrndCtx.fillRect(x * block, y * block, block, block);
  }
  plgrndCtx.fill()
}

function draw(mode) {
  // fetch sizes
  let containerWidth = parseInt(getComputedStyle(container).width); 
  let containerHeight = parseInt(getComputedStyle(container).height);

  if (mode === "init") {
    // "normalization"
    containerWidth = Math.round(containerWidth / 20) * 20 ;
    containerHeight = Math.round(containerHeight / 20) * 20;
    // apply the sizing 
    container.style.width = containerWidth + "px";
    container.style.height = containerHeight + "px";
    background.style.width = containerWidth + "px";
    background.style.height = containerHeight + "px";

    displayInfo(scrCtx);
    displayInfo(rcrdCtx);
  } else if (mode === "shrink") {
      // shrink container
      container.style.width = containerWidth - block + "px";
      container.style.height = containerHeight - block + "px";
      // clip background image
      background.style.clipPath = `inset(${clip + 1}px)`;
      clip += block/2;
    }
  // equal the size of <canvas> to the size of its parent
  playground.width = container.clientWidth;
  playground.height = container.clientHeight;
  // convert pixels to blocks
  playgroundWidth = playground.width / block;
  playgroundHeight = playground.height / block;

  drawBorder();
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

function displayInfo(ctx) {
  ctx.clearRect(4 * block , 0, 5 * block, block);
  ctx.font = `${block}px Courier`;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle"; 
  if (ctx === scrCtx) ctx.fillText(" Score:" + points, block/2, block/2);
  else if (ctx === rcrdCtx) ctx.fillText(" Record:" + best, block/2, block/2);
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

function resetSize() {
    container.style.width = "";
    container.style.height = "";
    background.style.clipPath = "none";
    clip = block/2;
    points = 0;
}

 function clearplayground() {
    plgrndCtx.clearRect(0, 0, playground.width, playground.height);
  }


// LOGIC 
class Snake {
  constructor() {
    this._init();
  }

  // snake
  move() {
    this._updateTail();
    this.xHead += this.xDirection ;
    this.yHead += this.yDirection;
    if (this.length < this.tail.length) this._deleteTail();
    if (this._checkCollision()) {
      this._gameOver();
    } else {
      this._checkSnakeFood();
      //console.log(this.xHead, this.yHead)
      this._drawSnake();
    }
  }

  _drawSnake(headColor="darkgreen", tailColor="green") {
    // head
    plgrndCtx.fillStyle = headColor;
    drawblock(this.xHead, this.yHead);
    // tail
    for (let i = 0; i < this.tail.length; i++) {
      plgrndCtx.fillStyle = tailColor;
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
    if (points > best) {
      best = points;
      displayInfo(rcrdCtx)
    }
    displayInfo(scrCtx);
    this.length++;
    this.speed++;
    this._checkShrink(); // playground size remains or shrinks
    if (!this._checkCollision()) { // if the game doesn't get reset because of collision
      this._randomFoodCreation();
      this._changeSpeed();
    }
  }

  _checkCollision() {
    if (
    this._coordInsideTail(this.xHead, this.yHead) ||
    this.xHead >= playgroundWidth - 2 ||
    this.xHead < 2 || this.tail.some((tailCoord) => tailCoord[0] < 2) || // head OR tail is in the left border spikes
    this.yHead >= playgroundHeight - 2 ||  
    this.yHead < 2 || this.tail.some((tailCoord) => tailCoord[1] < 2) // head OR tail is in the top border spikes
    ) {
      return true;
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
      if (this._coordInsideTail(x, y) || (x === this.xFood && y === this.yFood)) {
          continue;
        } else {
          return [x, y];
        }
      }
    }
  

  // general   
  _init() {
    points = 0;
    this.xHead = Math.floor(playgroundWidth / 2);
    this.yHead = Math.floor(playgroundHeight / 2);
    this.xDirection = 1;
    this.yDirection = 0;
    this.speed = 1;
    this.tail = [];
    this.length = 1;
    this.counterOuter = 1;
    this.counterInner = 0;
    this._randomFoodCreation();
    this.move(); // to create tail upon creation
  }
   
  _checkSnakeFood() {
    if (this.xHead === this.xFood && this.yHead === this.yFood) {
      this._grow();
    }
  }

  _changeSpeed() { // speed change
    clearInterval(intervalId); 
    windup(this.speed);
  }

  _coordInsideTail(x, y) {
    return this.tail.some((tailCoord) => tailCoord[0] === x && tailCoord[1] === y);
  }

  _checkShrink() {
    if (this.counterInner < this.counterOuter) {
      this.counterInner++;
      if (this.counterInner >= this.counterOuter) {
        this.counterInner = 0;
        this.counterOuter++;
        draw("shrink");
        this._snakeShrinkCoordsCorrection();
      }
    }
  }
    
  _snakeShrinkCoordsCorrection() {
    // snake is inside right border spikes after shrink()
    if (this.tail.some((tailCoord) => tailCoord[0] === playgroundWidth - 2) || this.xHead === playgroundWidth - 2) {
       // offset snake one block to the left
      this.tail.forEach((tailCoord) => tailCoord[0] -= 1);
      this.xHead -= 1;
    }
    // snake is inside bottom border spikes after shrink()
    if (this.tail.some((tailCoord) => tailCoord[1] === playgroundHeight - 2) || this.yHead === playgroundHeight - 2) {
       // offset snake one block up
      this.tail.forEach((tailCoord) => tailCoord[1] -= 1);
      this.yHead -= 1;
    }
  }

  _gameOver() {
    this._drawSnake("crimson", "coral");
    clearInterval(intervalId); // stop any movement
    startAgain.style.display = "block";
  }
}

function getRandomInt(min, max) {
    const result = Math.floor(Math.random() * ((max - min)) + min);
    return result;
  }

function freeze(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// controls 
const handleKeydown = (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (snake.yDirection !== 1) {
        snake.xDirection = 0;
        snake.yDirection = -1;
        html.removeEventListener("keydown", handleKeydown); // only one change per frame is allowed
      }
      break;

    case "ArrowRight":
      if (snake.xDirection !== -1) {
        snake.xDirection = 1;
        snake.yDirection = 0;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowDown":
      if (snake.yDirection !== -1) {
        snake.xDirection = 0;
        snake.yDirection = 1;
        html.removeEventListener("keydown", handleKeydown);
      }
      break;

    case "ArrowLeft":
      if (snake.xDirection !== 1) {
        snake.xDirection = -1;
        snake.yDirection = 0;
        html.removeEventListener("keydown", handleKeydown);
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
    snake.move();
  }, 1000 / speed); 
}

const gameStarter = (btn) => {
  btn.addEventListener("click", (event) => {
    resetSize();
    snake = new Snake()
    draw("init");
    windup(snake.speed);
    btn.style.display = "none";
    menu.style.display = "none";
  })
}

draw("init");

gameStarter(start);

gameStarter(startAgain);


