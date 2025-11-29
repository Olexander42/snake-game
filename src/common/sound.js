import getElement from "./getElement.js";

const soundIcon = getElement.soundIcon();

export const soundLibrary = {};
export let muted = true;

export function initSoundLibrary(theme) { 
  soundLibrary.bgMusic = new Audio(`./assets/${theme}/sounds/background.mp3`);
  soundLibrary.bite = new Audio(`./assets/${theme}/sounds/bite.mp3`);
  soundLibrary.gameOver = new Audio(`./assets/${theme}/sounds/game-over.mp3`);

  applyMutedState();
  if (!muted) soundLibrary.bgMusic.play();
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

  // recreate :active state on 'keydown'
  soundIcon.firstElementChild.classList.add("active"); 
  setTimeout(() => soundIcon.firstElementChild.classList.remove("active"), 100);
})

