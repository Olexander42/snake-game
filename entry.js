/*
import Board from "./src/components/Board.js";
import Snake from "./src/components/Snake.js";
import Food from "./src/components/Food.js";
import Game from "./Game.js";
import Menu from "./src/components/menu/Menu.js";




const game = new Game(Board, Snake, Food);
const menu = new Menu(game);
*/
import { startBtn, settingsBtn, html, soundIcon } from "./src/common/elements.js";
import initTheme from "./src/common/theme.js";
import { toggleMute } from "./src/common/sound.js";
import { handleStartBtn, handleSettingsBtn } from "./src/menu/menu.js";
import handleMenuNavigation from "./src/menu/keyboardNavigation.js";

initTheme();

html.addEventListener('keydown', handleMenuNavigation);
startBtn.addEventListener('click', handleStartBtn);
settingsBtn.addEventListener('click', handleSettingsBtn);
soundIcon.addEventListener('click', toggleMute);














































