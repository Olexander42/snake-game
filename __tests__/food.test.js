import { test, expect } from 'vitest';
import Food from "../src/components/Food.js";


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
  },
  {
    "x": 330,
    "y": 360,
  }
]

test("Food random coords get generated correctly", { repeats: 10000 }, () => {
   const coords = Food.generateRandomCoords(boardData, snakeData);

  expect(coords).toSatisfy((foodCoords) => 
    (boardData.bounds.left <= coords.x <= boardData.bounds.right)
    && (boardData.bounds.top <= coords.y <= boardData.bounds.bottom)
    && !([snakeData[0].x, snakeData[1].x].includes(coords.x)
    && [snakeData[0].y, snakeData[1].y].includes(coords.y)))
  }
)




