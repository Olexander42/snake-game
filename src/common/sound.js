export const soundLibrary = {};
export let soundIcon;

export let isMuted = true;

export function initSoundLibrary(theme) { 
  soundLibrary.bgMusic = new Audio(`../assets/${theme}/sounds/background.mp3`);
  soundLibrary.bite = new Audio(`../assets/${theme}/sounds/bite.mp3`);
  soundLibrary.gameOver = new Audio(`../assets/${theme}/sounds/game-over.mp3`);

  applyMutedState();
}

export function toggleMute() {
  isMuted = isMuted === false ? true : false;
  applyMutedState(); 
  toggleIcon();
}

export function initSoundIconEl() {
  soundIcon = document.getElementById("sound-icon");
}

function applyMutedState() {
  Object.values(soundLibrary).forEach((sound) => sound.muted = isMuted);

  if (!isMuted) soundLibrary.bgMusic.play();
}

function toggleIcon() {
  if (isMuted) soundIcon.classList.replace("sound-on", "sound-off");
  else soundIcon.classList.replace("sound-off", "sound-on");
}























