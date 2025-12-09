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
  toggleIcon();
}

function applyMutedState() {
  Object.values(soundLibrary).forEach((sound) => sound.muted = isMuted);
  if (!isMuted) soundLibrary.bgMusic.play();
}

let iconElement;

function toggleIcon() {
  if (isMuted) iconElement.classList.replace("sound-on", "sound-off");
  else iconElement.classList.replace("sound-off", "sound-on");
}


export const attachToggleMuteListener = () => {
  iconElement ??= document.getElementById("sound-icon");
  iconElement.addEventListener('click', () => toggleMute());
}















