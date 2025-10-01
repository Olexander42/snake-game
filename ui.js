import { border, containerEl, borderCenter, stats } from "./variables.js";

import { borderEl, backgroundEl, scoreEl, recordEl, sizes } from "./elements.js";

import { normalize } from "./utils.js";

root.style.setProperty("--size", `${sizes.width}px`);

containerEl.style.width = container.width + "px";
containerEl.style.height = container.height + "px";

function borderSize(mode) {
  if (mode === "ini") {
     // initialization
    sizes.border.width = sizes.container.width; 
    sizes.border.height = sizes.container.height;

    borderEl.style.width = border.width + "px";
    borderEl.style.height = border.height + "px";
    backgroundEl.style.width = border.width + "px";
    backgroundEl.style.height = border.height + "px";

    scoreEl.innerText = `Score: ${stats.score}`;
    recordEl.innerText = `Record: ${stats.record}`;

  } else if (mode === "shrink") {
      // shrink border
      sizes.border.width = borderEl.clientWidth - sizes.width;
      sizes.border.height = borderEl.clientHeight - sizes.width;
      borderEl.style.width = border.width + "px";
      borderEl.style.height = border.height + "px";

       // sizes.clip background image
      sizes.clip += sizes.step;
      backgroundEl.style.clipPath = `inset(${sizes.clip - 1}px)`;
    }
}

function checkShrinkBorder() {
  counter.inner++;
  if (counter.inner >= counter.outer && snake.nearOppositeSides()) {
    borderSize("shrink");

    snake.borderShrinkOffset();

    counter.inner = 0;
    counter.outer++;
  }
}