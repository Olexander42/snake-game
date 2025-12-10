export const soundLibrary = {};

let isMuted = true;
let soundIcon;

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

const toggleIcon = () => {
  if (isMuted) soundIcon.classList.replace("sound-on", "sound-off");
  else soundIcon.classList.replace("sound-off", "sound-on");
}


export const attachToggleMuteListener = () => {
  soundIcon = document.getElementById("sound-icon");
  soundIcon.addEventListener('click', toggleMute);
}




















