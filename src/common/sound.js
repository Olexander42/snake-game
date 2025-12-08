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
  toggleIcon(icon);
}

function applyMutedState() {
  Object.values(soundLibrary).forEach((sound) => sound.muted = isMuted);
  if (!isMuted) soundLibrary.bgMusic.play();
}


function toggleIcon() {
  if (isMuted) icon.classList.replace("sound-on", "sound-off");
  else icon.classList.replace("sound-off", "sound-on");
}


const icon = () => document.getElementById("soundIcon");
export const attachToggleMuteListener = () => icon().addEventListener('click', () => toggleMute());















