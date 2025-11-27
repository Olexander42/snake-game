import getElement from "../common/getElement.js";
import { initSoundLibrary, soundLibrary } from "./sound.js";


export default function setTheme(theme) {
  if (soundLibrary.bgMusic) soundLibrary.bgMusic.pause(); // force music switch
  initSoundLibrary(theme);
  
  getElement.html().style.setProperty('background-image', `url(./assets/${theme}/images/outside.jpg)`);
  getElement.border().style.setProperty('border-image-source', `url(./assets/${theme}/images/border.jpg)`);
  getElement.background().style.setProperty('background-image', `url(./assets/${theme}/images/inside.jpg)`);

  getElement.style().innerHTML = `
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
