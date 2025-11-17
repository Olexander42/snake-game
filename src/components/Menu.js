class Menu {
  constructor() {
    this.div = document.getElementById("main-menu");
    this.settingsDiv = document.getElementById("settings-menu");
    this.startBtn = document.getElementById("start-btn");
    this.settingsBtn = document.getElementById("settings-btn");

    this.settings = new Settings();

    this.firstStart = true;
    this.settingsVisited = false;
  }

  handleFirstStart() {
    this.startBtn.innerText = "Start Again";
    this.firstStart = false;
  }

  hide() {
    this.startBtn.style.display = 'none';
    this.settingsBtn.style.display = 'none';
  }
}

/*


  },
  }
}
*/

class Settings {
  constructor() {
    this.sizeSlider = document.getElementById("size-slider");
    this.buttonsSides = document.querySelectorAll(".side");
    this.colorOptions = document.querySelectorAll(".color-box");
    this.themeThumbnails = document.querySelectorAll(".thumbnail");
    this.back = document.getElementById("back-btn");

    this.visited = false;
  }
}

/*
const menuHandlers = { 
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

export default Menu;
