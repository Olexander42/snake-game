// const menuDiv = document.querySelector(".menu"); // Do I need this?
const gameMenuDiv = document.querySelector(".game-menu");
const settingsMenuDiv = document.querySelector(".settings-menu");

const menu = { 
  start: { 
    button: document.getElementById("start-btn"),
  },

  settings: { 
    button: document.getElementById("settings-btn"),
  }, 

  size: {
    button: document.getElementById("size-btn"),
    slider: document.getElementById("size-slider"),
  },

  back: {
    button: document.getElementById("back-btn"),
  },
}

export { menu, gameMenuDiv, settingsMenuDiv };