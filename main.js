import Board from "./src/components/Board.js";
import Snake from "./src/components/Snake.js";
import Food from "./src/components/Food.js";
import Game from "./Game.js";
import Menu from "./src/components/Menu.js";
import setTheme from "./src/common/setTheme.js";


const theme = document.querySelector('input[name="theme"]:checked').value;
setTheme(theme);

const game = new Game(Board, Snake, Food);
const menu = new Menu(game);













































