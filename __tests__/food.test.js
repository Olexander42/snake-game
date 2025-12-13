import { vi, test, expect } from 'vitest';
import { initFoodEl, generateRandomCoords } from "../src/components/food/food.js";

document.body.innerHTML = `<span id="food"></span>`;
vi.mock("../src/common/config.js", () => ( { getMinSizeUnit: () => 30 }));

const borders = {
  "left": 60,
  "right": 660,
  "top": 60,
  "bottom": 600
}

const { left, right, top, bottom } = borders;

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

initFoodEl();

test("Food random coords get generated correctly", { repeats: 1000 }, () => {
  const randomCoords = generateRandomCoords(borders, snakeCoords);

  expect(randomCoords).toSatisfy((foodCoords) => 
    (left <= randomCoords.x <= right)
    && (top <= randomCoords.y <= bottom)
    && !([snakeCoords[0].x, snakeCoords[1].x].includes(randomCoords.x)
    && [snakeCoords[0].y, snakeCoords[1].y].includes(randomCoords.y)))
  }
)




