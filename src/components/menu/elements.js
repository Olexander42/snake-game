const gameMenuDiv = document.querySelector(".game-menu");
const settingsMenuDiv = document.querySelector(".settings-menu");

const menuButtons = { 
  start: document.getElementById("start-btn"),
  settings: document.getElementById("settings-btn"),
  back: document.getElementById("back-btn"), 
}

const buttonSides = document.querySelectorAll(".side");

const sizeSlider = document.getElementById("size-slider");

const colorBoxes = document.querySelectorAll("#snake-color label");
const boxOutline = document.getElementById("box-outline");



export { gameMenuDiv, settingsMenuDiv, menuButtons, buttonSides, colorBoxes, sizeSlider, boxOutline }
