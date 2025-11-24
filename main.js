import Board from "./src/components/Board.js";
import Snake from "./src/components/Snake.js";
import Food from "./src/components/Food.js";
import Game from "./Game.js";
import Menu from "./src/components/Menu.js";
import { setTheme } from "./src/common/helpers.js";


const theme = document.querySelector('input[name="theme"]:checked').value;
setTheme(theme);

const board = new Board();
const snake = new Snake();
const food = new Food();
const game = new Game(board, snake, food);
const menu = new Menu(game);













































