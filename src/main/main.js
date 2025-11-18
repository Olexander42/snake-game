import Menu from "../components/Menu.js";
import Board from "../components/Board.js";
import Game from "./Game.js";
import { setTheme } from "../common/helpers.js";


// detach menu from container

const theme = document.querySelector('input[name="theme"]:checked').value;
const board = new Board();
setTheme(theme);

const snake = undefined;
const food = undefined;
const game = new Game(board, snake, food);

const menu = new Menu();
menu.attachListeners(game);













































