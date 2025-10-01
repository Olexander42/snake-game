import { getRandomInt, normalize } from "./utils.js";

import { sizes, borderCenter } from "./variables.js";

import { buttons, foodEl } from "./elements.js";

function moveFood() {
  let [x, y] = [null, null];

  const samePlace = () => {
    if (buttons.start.innerText === "Start Again") { // if game has already begun
      const [prevX, prevY] = [parseInt(foodEl.style.left),  parseInt(foodEl.style.top)]; 
      return (x === prevX && y === prevY);
    }
  }

  while (true) {
     [x, y] = [
        normalzie(getRandomInt(sizes.clip + sizes.step, container.width - sizes.clip - sizes.step * 2)), sizes.step,
        normalize(getRandomInt(sizes.clip + sizes.step, container.height - sizes.clip - sizes.step * 2)), sizes.step,
      ]; 

     if (snake.coordsInsideBody(x, y) || samePlace() || (x === borderCenter.x && y === borderCenter.y)) continue;
     else break;
  }

  foodEl.style.left = x + "px";
  foodEl.style.top = y + "px";
}


