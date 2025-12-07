import { vi, test, expect } from 'vitest';
import { init, getBoardData, generateRandomCoords } from "../src/components/food.js";

document.body.innerHTML = `<span id="food" style='opacity: 0'></span>`;
vi.mock("../src/common/elements.js", () => ({ sizeSlider: { value: '60' } } ));

const boardData = {
  "left": 60,
  "right": 660,
  "top": 60,
  "bottom": 600
}

const { left, right, top, bottom } = boardData;

const snakeData = [
  {
    "x": 390,
    "y": 360,
  },
  {
    "x": 360,
    "y": 360,
  }
]

init();
getBoardData(boardData);

test("Food random coords get generated correctly", { repeats: 10000 }, () => {
  const randomCoords = generateRandomCoords(snakeData);

  expect(randomCoords).toSatisfy((foodCoords) => 
    (left <= randomCoords.x <= right)
    && (top <= randomCoords.y <= bottom)
    && !([snakeData[0].x, snakeData[1].x].includes(randomCoords.x)
    && [snakeData[0].y, snakeData[1].y].includes(randomCoords.y)))
  }
)




