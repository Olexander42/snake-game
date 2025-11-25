import { test, expect, beforeEach } from 'vitest';
import Food from "../src/components/Food.js";

beforeEach(() => {
  document.body.innerHTML = `<div id="container"></div>`;
})

const boardData = 
  {
    "bounds": {
      "left": 60,
      "right": 600,
      "top": 60,
      "bottom": 540
    },
    "center": {
      "x": 360,
      "y": 360
    },
    "step": 30
  }

const snakeData = [
  {
    "x": 360,
    "y": 360,
    "rotation": ""
  },
  {
    "x": 330,
    "y": 360,
    "rotation": ""
  }
]

test("Food gets teleported correctly", { repeats: 10000 }, () => {
  const food = new Food();

  food.teleport(boardData, snakeData);

  expect(food.coords).toSatisfy((foodCoords) => 
    (boardData.bounds.left <= food.coords.x <= boardData.bounds.right)
    && (boardData.bounds.top <= food.coords.y <= boardData.bounds.bottom)
    && !([snakeData[0].x, snakeData[1].x].includes(food.coords.x)
    && [snakeData[0].y, snakeData[1].y].includes(food.coords.y)))
  }
)




