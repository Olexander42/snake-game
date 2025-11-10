class Sound {
  constructor() {
    this.audioCtx = new window.AudioContext();
    this.audioCtx.resume();
  }

  init(theme) { 
    this.menuMusic = new Audio(`../../assets/${theme}/music/menu-background.mp3`);
  }

  playMenuMusic() {
    this.audioCtx.resume();
    this.menuMusic.play();
  }
}

const soundLibrary = new Sound();


export { soundLibrary }; 