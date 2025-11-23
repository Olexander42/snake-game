import { test, expect, beforeEach } from 'vitest';
import Food from "../src/components/Food.js";

beforeEach(() => {
  document.body.innerHTML = `<div id="container"></div>`;
})

const boardData = { 
  "bounds": {
    "left": 60,
    "right": 660,
    "top": 60,
    "bottom": 540
  },
  "center": {
    "x": 420,
    "y": 360
  },
  "step": 30,
}

const snakeData = [
  {
    "x": 420,
    "y": 360,
    "rotation": ""
  },
  {
    "x": 390,
    "y": 360,
    "rotation": ""
  }
]

test("Food gets teleported correctly", { repeats: 10000 }, () => {
  const food = new Food();

  food.teleport(boardData, snakeData);
  
  const foodCoords = {};
  foodCoords.x = parseInt(food.element.style.left);
  foodCoords.y = parseInt(food.element.style.top);

  expect(foodCoords).toSatisfy((foodCoords) => 
    (boardData.bounds.left <= foodCoords.x <= boardData.bounds.right)
    && (boardData.bounds.top <= foodCoords.y <= boardData.bounds.bottom))
  }
)




