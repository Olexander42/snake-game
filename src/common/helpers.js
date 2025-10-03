import { board } from "../ui/board/board.js";

import { stats, shrinkCounter } from "../variables.js";

function reset() {
  snake.div.replaceChildren(); // delete snake

  // back to initial size
  board.borderEl.style.width = board.container.width;
  board.borderEl.style.height = board.container.height;
  board.backgroundEl.style.clipPath = "";

  board.clip = board.thick;

  stats.score = 0;

  shrinkCounter.reset();

  snake.ini();

  timeGapUpdate();

  root.style.setProperty("--turn", ""); // ❓
}

function timeGapUpdate() {
  time.gap = Math.round(time.unit / snake.speed);
  root.style.setProperty("--time-gap", `${time.gap / 1000}s`);
}