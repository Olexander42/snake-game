import { html as outsideBackground, borderEl, backgroundEl as insideBackground } from "./elements.js";
import { initSoundLibrary } from "./sound.js";

let style;

export default function setTheme() {
  const theme = document.querySelector('input[name="theme"]:checked').value;
  initSoundLibrary(theme);
  setImages(theme);
  setFonts(theme);
}

export function initStyleEl() {
  style = document.querySelector('style');
}

function setImages(theme) {
  outsideBackground.style.setProperty("background-image", `url(../assets/${theme}/images/outside.jpg)`);
  borderEl.style.setProperty("border-image-source", `url(../assets/${theme}/images/border.jpg)`);
  insideBackground.style.setProperty("background-image", `url(../assets/${theme}/images/inside.jpg)`);
}

function setFonts(theme) {
  style.innerHTML = `
    @font-face {
      font-family: "main";
      src: url("../assets/${theme}/fonts/main.woff2") format('woff2');
    }

    @font-face {
      font-family: "secondary";
      src: url("../assets/${theme}/fonts/secondary.woff2") format('woff2');
    }

    @font-face {
      font-family: "score";
      src: url("../assets/${theme}/fonts/score.woff2") format('woff2');
    }
  `
}




