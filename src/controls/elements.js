// const menuDiv = document.querySelector(".menu"); // Do I need this?
const gameMenuDiv = document.querySelector(".game-menu");
const settingsMenuDiv = document.querySelector(".settings-menu");

const menuButtons = { 
  start: document.getElementById("start-btn"),
  settings: document.getElementById("settings-btn"),
  back: document.getElementById("back-btn"),
}

export { menuButtons, gameMenuDiv, settingsMenuDiv };