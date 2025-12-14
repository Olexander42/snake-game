import * as Data from "./data.js";


export function spawn(center) {
  const snakeColor = document.querySelector('input[name="snake-color"]:checked').value;
  Data.initColorManager(snakeColor);
  
  Data.setIsAlive(true);
  Data.setDirection(1, 0);
  Data.resetHeadRotation();
  Data.resetSpeed();
  Data.initStep();

  if (!Data.snakeDiv) Data.initSnakeDiv();
  createHead(center);
}

export function snapshot() { 
  Data.updateBodyElements()
  Data.emptyBodyData();

  Data.getBodyElements().forEach((section) => {
    const [x, y] = [parseInt(section.style.left), parseInt(section.style.top)]
    Data.bodyDataAdd(x, y);
  })
}

export function greyoutBody(duration) {
  const DESATURATION = 0.15
  Data.colorManager.hslComponents.s *= DESATURATION;

  let timeLeft = duration;
  let i = 0;
  let length = Data.getBodyElements().length;

  Data.getBodyElements().forEach((section, i) => {
    const progress = length - i;
    const delay = timeLeft / (progress ** 2); // Each section exponentially takes longer to greyout,
    timeLeft -= delay; // but the total duration stays the same.
    
    setTimeout(() => {
      const color = Data.colorManager.changeColor({ changeL: i }); // preserve the original lightness
      section.style.backgroundColor = color;
    }, delay)
  })
}

export const isAteFood = (foodCoords) => { 
  return Data.getHeadCoords().x === foodCoords.x && Data.getHeadCoords().y === foodCoords.y;
}

export const emptyOut = () => Data.snakeDiv.replaceChildren();

function createHead({ x, y }) {
  const section = document.createElement('span');

  section.classList.add(`${"snake-section"}`);
  section.id = "head";
  section.style.left = `${x}px`;
  section.style.top = `${y}px`;
  section.style.backgroundColor =  Data.colorManager.changeColor({ changeL: -2 });

  Data.snakeDiv.append(section);
  snapshot();
}






