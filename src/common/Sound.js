class Sound {
  constructor() {
    this.muted = true;
    this.library = {};
  }

  init(theme) { 
    this.library.bgMusic = new Audio(`./assets/${theme}/sounds/background.mp3`);
    this.library.bgMusic.loop = true;
    this.library.bgMusic.volume = 0.25;
    this.library.bgMusic.play();

    this.library.bite = new Audio(`./assets/${theme}/sounds/bite.mp3`);
    this.library.bite.volume = 0.15;

    this.library.gameOver = new Audio(`./assets/${theme}/sounds/game-over.mp3`);
    this.library.gameOver.volume = 0.1;

    this._applyMutedState();
  }

  toggleMutedState() {
    this.muted = this.muted === false ? true : false;
    this._applyMutedState();
  }

  _applyMutedState() {
    Object.values(this.library).forEach(sound => sound.muted = this.muted);
  }
}

const sound = new Sound();


export { sound }; 