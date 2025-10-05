// const menuDiv = document.querySelector(".menu"); // Do I need this?
const gameMenuDiv = document.querySelector(".game-menu");
const settingsMenuDiv = document.querySelector(".settings-menu");

const menuButtons = { 
  start: document.querySelector(".start-btn"),
  settings: document.querySelector(".settings-btn"),
  size: document.getElementById("size"),
  back: document.getElementById("back"),
}

export { menuButtons, gameMenuDiv, settingsMenuDiv };