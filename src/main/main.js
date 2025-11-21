import Board from "../components/Board.js";
import Snake from "../components/Snake.js";
import Game from "./Game.js";
import Menu from "../components/Menu.js";
import { setTheme } from "../common/helpers.js";

const theme = document.querySelector('input[name="theme"]:checked').value;
setTheme(theme);

const board = new Board();
const snake = new Snake();
const food = undefined; // I mock food for now 
const game = new Game(board, snake, food);
const menu = new Menu(game);














































