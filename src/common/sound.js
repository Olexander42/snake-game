import getElement from "./getElement.js";

const soundIcon = getElement.soundIcon();

export const soundLibrary = {};
export let muted = true;

export function initSoundLibrary(theme) { 
  soundLibrary.bgMusic = new Audio(`./assets/${theme}/sounds/background2.mp3`);
  soundLibrary.bgMusic.loop = true;
  soundLibrary.bgMusic.volume = 0.5;
  soundLibrary.bgMusic.play();

  soundLibrary.bite = new Audio(`./assets/${theme}/sounds/bite.mp3`);
  soundLibrary.bite.volume = 0.2;

  soundLibrary.gameOver = new Audio(`./assets/${theme}/sounds/game-over.mp3`);
  soundLibrary.gameOver.volume = 0.1;

  applyMutedState();
}

function applyMutedState() {
  Object.values(soundLibrary).forEach((sound) => { 
    sound.muted = muted;
  });
}

soundIcon.addEventListener('click', () => {
  muted = muted === false ? true : false;
  applyMutedState();

  soundLibrary.bgMusic.play();

  if (!soundIcon.classList.replace("sound-off", "sound-on")) {
    soundIcon.classList.replace("sound-on", "sound-off");
  }
})

