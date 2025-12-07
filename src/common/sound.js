import { soundIcon } from "./elements.js";


let isMuted = true;

export const soundLibrary = {};

export function initSoundLibrary(theme) { 
  soundLibrary.bgMusic = new Audio(`../assets/${theme}/sounds/background.mp3`);
  soundLibrary.bite = new Audio(`../assets/${theme}/sounds/bite.mp3`);
  soundLibrary.gameOver = new Audio(`../assets/${theme}/sounds/game-over.mp3`);

  applyMutedState();
}

export function toggleMute() {
  isMuted = isMuted === false ? true : false;
  applyMutedState(); 
  toggleSoundIcon();
}

function applyMutedState() {
  Object.values(soundLibrary).forEach((sound) => sound.muted = isMuted);
  if (!isMuted) soundLibrary.bgMusic.play();
}

function toggleSoundIcon() {
  if (isMuted) soundIcon.classList.replace("sound-on", "sound-off");
  else soundIcon.classList.replace("sound-off", "sound-on");
}












