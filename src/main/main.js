import Menu from "../components/Menu.js";
import Board from "../components/Board.js";
import Snake from "../components/Snake.js";
import Game from "./Game.js";
import { setTheme } from "../common/helpers.js";

const theme = document.querySelector('input[name="theme"]:checked').value;
setTheme(theme);

const board = new Board();
const snake = new Snake();
const food = undefined;
const game = new Game(board, snake, food);
const menu = new Menu(game);














































