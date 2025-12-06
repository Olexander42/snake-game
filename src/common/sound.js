export const soundIcon = document.getElementById("sound-icon");
export const soundLibrary = {};

let isMuted = true;

export function initSoundLibrary(theme) { 
  soundLibrary.bgMusic = new Audio(`../assets/${theme}/sounds/background.mp3`);
  soundLibrary.bite = new Audio(`../assets/${theme}/sounds/bite.mp3`);
  soundLibrary.gameOver = new Audio(`../assets/${theme}/sounds/game-over.mp3`);

  applyMutedState();
  if (!isMuted) soundLibrary.bgMusic.play();
}

export function toggleMute() {
  isMuted = isMuted === false ? true : false;

  // Toggle sound icon.
  if (isMuted) soundIcon.classList.replace("sound-on", "sound-off");
  else soundIcon.classList.replace("sound-off", "sound-on");

  applyMutedState(); 
  if (!isMuted) soundLibrary.bgMusic.play();
}

const applyMutedState = () => Object.values(soundLibrary).forEach((sound) => sound.muted = isMuted);








