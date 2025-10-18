const gameMenuDiv = document.getElementById("main-menu");
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


export { gameMenuDiv, settingsMenuDiv, menuButtons, buttonSides, colorBoxes, thumbnails, sizeSlider }
