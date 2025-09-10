const html = document.querySelector("html");
const wrapper = document.querySelector(".wrapper");
const backgroundImg = document.querySelector(".background-image");
const container = document.querySelector(".container");
const playground = document.querySelector(".playground");
const score = document.querySelector(".score");

const plgrndCtx = playground.getContext("2d");
const scrCtx = score.getContext("2d");
let points = 0;
let playgroundWidth;
let playgroundHeight;
let intervalId;

/* 
- control 360 turn bug
- pause the game on death (something goes wrong if snake dies between framed)
- show best result (from current sessions as well all time)
- menu (start / stats / settings (snake color / block size))
- snake gradient color
- restraing control
- border image (bricks)
*/

// VISUALS
const block = 20;
let clip = block/2; // clip-path value to use on backgroundImg

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

function draw(mode) {
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
    wrapper.style.width = containerWidth + "px";
    wrapper.style.height = containerHeight + "px";

    drawScore();
  } else if (mode === "shrink") {
      // shrink container
      container.style.width = containerWidth - block + "px";
      container.style.height = containerHeight - block + "px";

      // clip background image
      backgroundImg.style.clipPath = `inset(${clip}px)`;
      clip += block/2;
    }
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

function drawScore() {
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

function resetSize() {
    container.style.width = "";
    container.style.height = "";
    wrapper.style.width = "";
    wrapper.style.height = "";
    backgroundImg.style.clipPath = `none`;
    clip = block/2;
}


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
    this.length++;
    this.speed++;
    this._checkShrink(); // playground size remains or shrinks
    if (!this._checkCollision()) { // if the game doesn't get reset because of collision
      this._randomFoodCreation();
      this._initWindup();
      drawScore();
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
    console.log("I'm inside _randomFoodCreation");
    [this.xFood, this.yFood] = this._getRandomFoodCoord();
    this._drawFood();
  }

  _drawFood() {
    console.log("I'm inside _drawFood");
    plgrndCtx.fillStyle = "red";
    drawblock(this.xFood, this.yFood, "circle");
  } 

  _getRandomFoodCoord() { 
    console.log("I'm inside _getRandomFoodCoord");
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
    this._clearplayground();
    points = 0;
    draw("init");
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

  async _initWindup(mode="grow") { // speed change
    clearInterval(intervalId); // stop animation
    if (mode === "reset") {
      await freeze(5000);  // pause on the moment of collision before starting movement again
      this.speed = 1;
    }
    windup(this.speed);
  }

  _coordInsideTail(x, y) {
    return this.tail.some((tailCoord) => tailCoord[0] === x && tailCoord[1] === y);
  }

  _clearplayground() {
    plgrndCtx.clearRect(0, 0, playground.width, playground.height);
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

  async _gameOver() {
    this._drawSnake("crimson", "coral");
    // reset the game 
    this._initWindup("reset"); 
    await freeze(5000); // don't redraw untill freeze() inside this._initWindup() done waiting
    resetSize();
    this._init(); 
  }

}

function getRandomInt(min, max) {
    //if (min >= max) throw new RangeError("min can't be equal to max");
    const result = Math.floor(Math.random() * ((max - min)) + min);
    console.log(result);
    return result;
  }

function freeze(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// controls 
html.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (snake.yDirection !== 1) {
        snake.xDirection = 0;
        snake.yDirection = -1;
      }
      break;

    case "ArrowRight":
      if (snake.xDirection !== -1) {
        snake.xDirection = 1;
        snake.yDirection = 0;
      }
      break;

    case "ArrowDown":
      if (snake.yDirection !== -1) {
        snake.xDirection = 0;
        snake.yDirection = 1;
      }
      break;

    case "ArrowLeft":
      if (snake.xDirection !== 1) {
        snake.xDirection = -1;
        snake.yDirection = 0;
      }
      break;
  }
})

// start the game 
const snake = new SnakeGame();

function windup(speed) {
  intervalId = setInterval(() => {
    snake.move();
  }, 1000 / speed); 
}

windup(1);
