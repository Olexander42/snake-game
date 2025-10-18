const gameMenuDiv = document.querySelector(".main-menu");
const settingsMenuDiv = document.getElementById("settings-menu");

const menuButtons = { 
  start: document.getElementById("start-btn"),
  settings: document.getElementById("settings-btn"),
  back: document.getElementById("back-btn"), 
}

const buttonSides = document.querySelectorAll(".side");

const sizeSlider = document.getElementById("size-slider");

const colorBoxes = document.querySelectorAll(".color-box");
const thumbnails = document.querySelectorAll(".thumbnail");

/*
const outlines = {
  colorBox: document.getElementById("color-box-outline"),
  thumbnail: document.getElementById("thumbnail-outline"),
}
*/



export { gameMenuDiv, settingsMenuDiv, menuButtons, buttonSides, colorBoxes, thumbnails, sizeSlider }
