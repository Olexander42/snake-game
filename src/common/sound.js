import { soundIcon } from "./elements.js";


export const soundLibrary = {};
let muted = true;

export function initSoundLibrary(theme) { 
  soundLibrary.bgMusic = new Audio(`./assets/${theme}/sounds/background.mp3`);
  soundLibrary.bite = new Audio(`./assets/${theme}/sounds/bite.mp3`);
  soundLibrary.gameOver = new Audio(`./assets/${theme}/sounds/game-over.mp3`);

  Object.values(soundLibrary).forEach((sound) => sound.muted = muted; 
  if (!muted) soundLibrary.bgMusic.play();
}

export function toggleMute() {
  muted = muted === false ? true : false;
  Object.values(soundLibrary).forEach((sound) => sound.muted = muted; 

  soundLibrary.bgMusic.play();

  if (!soundIcon.classList.replace("sound-off", "sound-on")) {
    soundIcon.classList.replace("sound-on", "sound-off");
  }
}




