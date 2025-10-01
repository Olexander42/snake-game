import { buttons, menuDiv } from "./elements.js";

import { reset } from "./helpers.js";

import { wait } from "./utils.js";

async function handleStartButton() {
  if (buttons.start.innerText === "Start Again") {
    reset();

    await wait(1000);

    borderSize("ini");
  }

  buttons.start.innerText = "Start Again";
  menuDiv.style.display = 'none';
  document.querySelectorAll(".block").forEach((el) => el.remove()); // remove snake and food

  game = new SnakeGame();

  timeGapUpdate();

  windup();
}

const handleSettingsButton = () => {
  mainMenu.style.display = "none";
  settingsMenu.style.display = "flex"
}

const handleSizeInput = () => {
  reset();
  sizes.width = Math.floor(buttons.size.value / 2) * 2;
  sizes.step = sizes.width / 2;
  root.style.setProperty("--sizes.width", `${sizes.width}px`);
  borderSize("ini");
  game = new SnakeGame();
}

buttons.start.addEventListener("click", handleStartButton);

buttons.settings.addEventListener("click", handleSettingsButton);

buttons.size.addEventListener('input', handleSizeInput);

