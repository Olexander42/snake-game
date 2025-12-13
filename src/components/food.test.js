import { vi, test, expect } from 'vitest';
import { spawn, getFoodCoords } from "./food.js";

document.body.innerHTML = `<span id="food"></span>`;
vi.mock("../common/config.js", () => ( { getMinSizeUnit: () => 30 }));

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

test("Food random coords get generated correctly", { repeats: 10000 }, () => {
  spawn(borders, snakeCoords);

  expect(getFoodCoords()).toSatisfy(({ x, y }) => 
    (left <= x <= right)
    && (top <= y <= bottom)
    && !([snakeCoords[0].x, snakeCoords[1].x].includes(x)
    && [snakeCoords[0].y, snakeCoords[1].y].includes(y)))
  }
)




