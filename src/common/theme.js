import { initSoundLibrary, soundLibrary } from "./sound.js";
import { html, border, background } from "./elements.js";


export default function setTheme() {
  const theme = document.querySelector('input[name="theme"]:checked').value;

  if (soundLibrary.bgMusic) soundLibrary.bgMusic.pause(); // force music switch
  initSoundLibrary(theme);
  
  html.style.setProperty('background-image', `url(./assets/${theme}/images/outside.jpg)`);
  border.style.setProperty('border-image-source', `url(./assets/${theme}/images/border.jpg)`);
  background.style.setProperty('background-image', `url(./assets/${theme}/images/inside.jpg)`);

  const style = document.querySelector('style');
  style.innerHTML = `
    @font-face {
      font-family: "main";
      src: url("./assets/${theme}/fonts/main.woff2") format('woff2');
    }

    @font-face {
      font-family: "secondary";
      src: url("./assets/${theme}/fonts/secondary.woff2") format('woff2');
    }

    @font-face {
      font-family: "score";
      src: url("./assets/${theme}/fonts/score.woff2") format('woff2');
    }
  `
}

