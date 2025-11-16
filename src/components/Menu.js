class MainMenu {
  constructor() {
    this.div = document.getElementById("main-menu");
    this.settingsDiv = document.getElementById("settings-menu");
    this.startBtn = document.getElementById("start-btn");
    this.settingsBtn = document.getElementById("settings-btn");

    this.firstStart = true;
  }

  startHandler(game) {
    if (this.firstStart) {
      this.startBtn.innerText = "Start Again";
      this.firstStart = false;
    }

    else {
      game.reset();
    }

    this.startBtn.style.display = 'none';
    this.settingsBtn.style.display = 'none';

    game.begin();
  }
}

/*
    food.generateRandomCoords(snake.bodyData);
    food.teleport();
    food.fadeIn();

    windup();


  },
  }
}

class SettingsMenu {
  constructor() {
    this.buttonsSides = document.querySelectorAll(".side");
    this.sizeSlider = document.getElementById("size-slider");
    this.colorOptions = document.querySelectorAll(".color-box");
    this.themeThumbnails = document.querySelectorAll(".thumbnail");
    this.back = document.getElementById("back-btn");

    this.visited = false;
  }
}


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
*/

export default MainMenu;
