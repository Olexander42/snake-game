import Menu from "../components/Menu.js";
import Board from "../components/Board.js";
import Game from "./Game.js";
import { setTheme } from "../common/helpers.js";


const theme = document.querySelector('input[name="theme"]:checked').value;
const board = new Board();
setTheme(theme, board);

const menu = new Menu();

const snake = undefined;
const food = undefined;
const game = new Game(board, snake, food);

menu.startBtn.addEventListener('click', () => { 
  if (menu.firstStart) {
    const sizeUnit = menu.settings.sizeSlider.value;
    board.normalize(sizeUnit);
    
    menu.handleFirstStart();
  }

  else {
    game.reset();
  }

  menu.hide();
  game.begin();
});










































