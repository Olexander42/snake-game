export let soundLibrary;
export let soundIcon;

export let isMuted = true;

let isFirstInteraction = true;

export function initSoundLibrary(theme) { 
  if (soundLibrary) soundLibrary.bgMusic.pause(); // allow bgMusic to change

  soundLibrary = {
    bgMusic: new Audio(`../assets/${theme}/sounds/background.mp3`),
    bite: new Audio(`../assets/${theme}/sounds/bite.mp3`),
    gameOver: new Audio(`../assets/${theme}/sounds/game-over.mp3`),
  };

  applyMutedState();
  if (!isMuted || !isFirstInteraction) soundLibrary.bgMusic.play(); 
}

export function toggleMute() {
  isMuted = isMuted === false ? true : false;
  toggleIcon();
  applyMutedState(); 

  if (isFirstInteraction) {
    soundLibrary.bgMusic.play();
    isFirstInteraction = false;
  }
}

export function initSoundIconEl() {
  soundIcon = document.getElementById("sound-icon");
}

function toggleIcon() {
  if (isMuted) soundIcon.classList.replace("sound-on", "sound-off");
  else soundIcon.classList.replace("sound-off", "sound-on");
  console.log(soundLibrary.bgMusic.muted)
}

const applyMutedState = () => Object.values(soundLibrary).forEach((sound) => sound.muted = isMuted);























