
// common 
import { stats, states } from "../../common/variables.js";
import { windup, reset, setTheme } from "../../common/helpers.js";
import { sound } from "../../common/Sound.js";

// menu
import { gameMenuDiv, settingsMenuDiv, buttonSides, sizeSlider, menuButtons, colorBoxes, thumbnails } from "./elements.js";
import { slider, outlines, flipButton, closeButtons } from "./helpers.js";


const menuHandlers = { 
  startHandler() {
    if (menuButtons.start.innerText === "Start Again") { // not first game?
      if (game.isNewRecord) game.updateRecord
      if (stats.score.value > stats.record.value) { 
        stats.record.value = stats.score.value;
        stats.record.element.innerText = "Record: " + stats.record.value;
      }

      reset();
      sound.library.bgMusic.play()
    }

    if (menuButtons.start.innerText === "Start") menuButtons.start.innerText = "Start Again";
    Object.values(menuButtons).forEach((button) => button.style.display = 'none');

    snake.init();

    food.generateRandomCoords(snake.bodyData);
    food.teleport();
    food.fadeIn();

    windup();
  },

  settingsHandler() {
    gameMenuDiv.style.display = 'none';
    settingsMenuDiv.style.display = 'flex';

    if (!states.settingsVisited) { 
      [...buttonSides].forEach((side) => side.addEventListener('click', flipButton));
      board.borderEl.addEventListener('click', closeButtons);

      sizeSlider.addEventListener('input', () => slider.moveThumb());

      Object.values(outlines).forEach((outline) => outline.goToChecked());

      [...colorBoxes].forEach((colorBox) => colorBox.addEventListener('click', (e) => {
        outlines.colorBox.disableCssOutline();
        outlines.colorBox.move(e.currentTarget);
      }));

      
      [...thumbnails].forEach((thumbnail) => thumbnail.addEventListener('click', (e) => {
        outlines.themeThumbnail.disableCssOutline();
        outlines.themeThumbnail.move(e.currentTarget)
        outlines.themeThumbnail.element.addEventListener('transitionend', () => setTheme());
      }))

      menuButtons.back.addEventListener('click', menuHandlers.backHandler);
    }

    states.settingsVisited = true;
  },

  backHandler() {
    settingsMenuDiv.style.display = 'none';
    gameMenuDiv.style.display = 'flex';
  }
}


export { menuHandlers };
