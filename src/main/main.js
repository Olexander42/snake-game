import MainMenu from "../components/Menu.js";
import Board from "../components/Board.js";
import Game from "./Game.js";
import { getThemeValue, setTheme } from "../common/helpers.js";


const size_unit = 40;
const theme = getThemeValue();

const board = new Board(size_unit);
setTheme(theme, board);

const snake = undefined;
const food = undefined;
const game = new Game(board, snake, food);
const menu = new MainMenu();
menu.startBtn.addEventListener('click', () => { menu.startHandler(game) });










































