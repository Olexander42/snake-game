import { vi, test, expect } from 'vitest';
import { generateRandomCoords } from "../src/components/food.js";

document.body.innerHTML = `<span id="food"></span>`;
vi.mock("../src/common/config.mjs", () => ( { getMinSizeUnit: () => 30 }));

const boardData = {
  "left": 60,
  "right": 660,
  "top": 60,
  "bottom": 600
}

const snakeCoords = [
  {
    "x": 390,
    "y": 360,
  },
  {
    "x": 360,
    "y": 360,
  }
]

const { left, right, top, bottom } = boardData;

test("Food random coords get generated correctly", { repeats: 10000 }, () => {
  const randomCoords = generateRandomCoords(boardData, snakeCoords);

  expect(randomCoords).toSatisfy((foodCoords) => 
    (left <= randomCoords.x <= right)
    && (top <= randomCoords.y <= bottom)
    && !([snakeCoords[0].x, snakeCoords[1].x].includes(randomCoords.x)
    && [snakeCoords[0].y, snakeCoords[1].y].includes(randomCoords.y)))
  }
)




