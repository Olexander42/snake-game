const menuDiv = document.querySelector(".menu");

const menuButtons = { 
  mainMenu: {
    start: document.querySelector(".start-btn"),
    settings: document.querySelector(".settings-btn"),
  }

  settings: {
    size: document.getElementById("size"),
  }
  
}

export { menuButtons, menuDiv };