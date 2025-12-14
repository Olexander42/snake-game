import { html as outsideBackground, borderEl, backgroundEl as insideBackground } from "./elements.js";
import { initSoundLibrary, soundLibrary, isMuted } from "./sound.js";

let theme, style;

export default function setTheme() {
  theme = document.querySelector('input[name="theme"]:checked').value;
  setImages();
  setFonts();
  initSoundLibrary(theme);
}

function setImages() {
  outsideBackground.style.setProperty("background-image", `url(../assets/${theme}/images/outside.jpg)`);
  borderEl.style.setProperty("border-image-source", `url(../assets/${theme}/images/border.jpg)`);
  insideBackground.style.setProperty("background-image", `url(../assets/${theme}/images/inside.jpg)`);
}

function setFonts() {
  style ??= document.querySelector('style');
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




