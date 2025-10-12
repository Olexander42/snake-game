const gameMenuDiv = document.querySelector(".game-menu");
const settingsMenuDiv = document.querySelector(".settings-menu");

const menuButtons = { 
  start: document.getElementById("start-btn"),
  settings: document.getElementById("settings-btn"),
  back: document.getElementById("back-btn"), 
}

const buttonSides = document.querySelectorAll(".side");
const sizeSlider = document.getElementById("size-slider");


export { gameMenuDiv, settingsMenuDiv, menuButtons, buttonSides, sizeSlider };
