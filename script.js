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
const stats = {score: 0, record: 0};
let playgroundWidth = 0;
let playgroundHeight = 0;
let playgroundCenter = {};
let intervalId = 0;
let snake;



/* 
- settings (snake color / block size / hard ))
- minmax size
- rewrite canvas in css
*/

// VISUALS
const block = 20;
let clip = block/2; // clip-path value to use on background

[score, record].forEach((el) => {
  el.width = block * 7;
  el.height = block;
})

function drawBlock(x, y, color) {
  plgrndCtx.fillStyle = color;
  plgrndCtx.beginPath();
  plgrndCtx.fillRect(x * block, y * block, block, block);
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

    score.innerText = `Score: ${stats.score}`;

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

  playgroundCenter = {x: Math.floor(playgroundWidth / 2), y: Math.floor(playgroundHeight / 2)};

  drawSpikes();
}

function drawSpike(i=1, j=1, base, direction) {
  let step = block / 2;
  let x = step  * i;
  let y = step  * j;
  if (base === "horizontal") {
    plgrndCtx.beginPath();
    plgrndCtx.moveTo(x, y);
    direction === "down" 
      ? plgrndCtx.lineTo(x + step/2, y + step) 
      : plgrndCtx.lineTo(x + step/2, y - step);
    plgrndCtx.lineTo(x + step, y);
    plgrndCtx.fill();
  } else if (base === "vertical") {
      plgrndCtx.beginPath();
      plgrndCtx.moveTo(x, y);
      direction === "left" 
        ? plgrndCtx.lineTo(x - step, y + step/2) 
        : plgrndCtx.lineTo(x + step, y + step/2)
      plgrndCtx.lineTo(x, y + step);
      plgrndCtx.fill();
    }
}

function drawSpikes() {
  // width and height of inner border in blocks
  const hLength = (playgroundWidth - 1) * 2; 
  const vLength = (playgroundHeight - 1) * 2;
  // horizontal base
  for (let i = 2; i < hLength; i++) {
    drawSpike(i, 2, "horizontal", "down");
    drawSpike(i, vLength, "horizontal", "up");
  }
  // vertical base 
  for (let j = 3; j < vLength - 1; j++) {
    drawSpike(hLength, j, "vertical", "left");
    drawSpike(2, j, "vertical", "right");
  }
}

function resetSize() {
    container.style.width = "";
    container.style.height = "";
    background.style.clipPath = "none";
    clip = block/2;
    stats.score = 0;
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
    this.body.head.x += this.xDirection;
    this.body.head.y += this.yDirection;
    if (this.length < this.body.tail.length) this._deleteTail();

    if (this._checkCollision()) {
      this._gameOver();
    } else {
      this._checkSnakeFood();
      //console.log(this.body.head.x, this.body.head.y)
      this._drawSnake();
    }
  }

  _drawSnake(ms=0) {
    return new Promise((resolve) => {
      // head
      drawBlock(this.body.head.x, this.body.head.y, `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l * 0.75}%)`);
      
      //tail
      let i = 0;
      const drawTailSection = (i) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const lighterColor = `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l + i + 1}%)`
            drawBlock(this.body.tail[i].x, this.body.tail[i].y, lighterColor);
            i++;
            if (i < this.body.tail.length) resolve(drawTailSection(i)); // each iteration has to pass `resolve` up the chain
            else resolve(true);                                        // otherwise only the last tail section passes up `resolve`
          }, ms)                                                      // to the second to last section and after that nothing happens
        })
      }

      drawTailSection(i).then(() => resolve(wait(ms * this.speed)));
    })
  }
  

  _updateTail() {
    this.body.tail.unshift({  // grow tail by "remembering" head coords
      x: this.body.head.x, 
      y: this.body.head.y,
    });
  }

  _deleteTail() {
    let tailPoint = this.body.tail.pop(); // get the last coords of tail
    plgrndCtx.clearRect(tailPoint.x * block, tailPoint.y * block, block, block);
  }

  _grow() {
    stats.score++;
    if (stats.score > stats.record) {
      stats.record = stats.score;
      record.innerText = `Record: ${stats.record}`;
    }
    score.innerText = `Score: ${stats.score}`;
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
    this._coordInsideTail(this.body.head.x, this.body.head.y) ||
    this.body.head.x >= playgroundWidth - 2 ||
    this.body.head.x < 2 || this.body.tail.some((tailCoord) => tailCoord.x < 2) || // head OR tail is in the left border spikes
    this.body.head.y >= playgroundHeight - 2 ||  
    this.body.head.y < 2 || this.body.tail.some((tailCoord) => tailCoord.y < 2) // head OR tail is in the top border spikes
    ) {
      return true;
    }
  }

  // food
  _getRandomFoodCoord() { 
    while (true) {
      let [x, y] = [
        getRandomInt(2, playgroundWidth - 2), 
        getRandomInt(2, playgroundHeight - 2)
        ]; 
      if (this._coordInsideTail(x, y) ||
         (x === this.body.head.x && y === this.body.head.y)) {
          continue;
        } else {
          return {x, y};
        }
      }
    }

  _randomFoodCreation() {
    this.food = this._getRandomFoodCoord();
    this.food.color = "red";
    this._drawFood();
  }

  _drawFood() {
    drawBlock(this.food.x, this.food.y, this.food.color);
  } 

  _checkSnakeFood() {
    if (this.body.head.x === this.food.x && this.body.head.y === this.food.y) {
      this._grow();
    }
  }
  

  // general   
  _init() {
    // snake
    this.body = { //  snake sections coords
      head: {x: playgroundCenter.x, y: playgroundCenter.y}, 
      tail: [{x: playgroundCenter.x - 1, y: playgroundCenter.y}],
      }; 
    this.length = 1;
    this.speed = 1;
    this.xDirection = 1;
    this.yDirection = 0;

    // colors
    this.color = "hsl(120, 100%, 25%)";
    this.hsl = this._splitColor();
    
    // shrink 
    this.counterOuter = 1;
    this.counterInner = 0;

    this._drawSnake();
    this._randomFoodCreation();
  }

  _splitColor() {
    let hsl = this.color.match(/\d+/g);
    hsl = hsl.map((val) => Number(val)); 
    return {h: hsl[0], s: hsl[1], l: hsl[2]};
  }

  _changeSpeed() { // speed change
    clearInterval(intervalId); 
    windup(this.speed);
  }

  _coordInsideTail(x, y) {
    return this.body.tail.some((tailCoord) => tailCoord.x === x && tailCoord.y === y);
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
    if (this.body.tail.some((tailCoord) => tailCoord.x === playgroundWidth - 2) || this.body.head.x === playgroundWidth - 2) {
       // offset snake one block to the left
      this.body.tail.forEach((tailCoord) => tailCoord.x -= 1);
      this.body.head.x -= 1;
    }
    // snake is inside bottom border spikes after shrink()
    if (this.body.tail.some((tailCoord) => tailCoord.y === playgroundHeight - 2) || this.body.head.y === playgroundHeight - 2) {
       // offset snake one block up
      this.body.tail.forEach((tailCoord) => tailCoord.y -= 1);
      this.body.head.y -= 1;
    }
  }

  _gameOver() {
    clearInterval(intervalId); // stop any movement
    this.hsl.s *= 0.1;
    this._drawSnake(250 / this.speed)
      .then(() => startAgain.style.display = "block");
  }
}

function getRandomInt(min, max) {
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

    case "p": // pause
      if (intervalId !== 0) {
        clearInterval(intervalId);
        intervalId = 0;
      } else {
        windup(snake.speed);
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
  }, 500 / speed); 
}

const gameStarter = (btn) => {
  btn.addEventListener("click", (event) => {
    resetSize();
    draw("init");
    snake = new Snake();
    windup(snake.speed);
    btn.style.display = "none";
    menu.style.display = "none";
  })
}

draw("init");

gameStarter(start);

gameStarter(startAgain);


