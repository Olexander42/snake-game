import Board from "../components/board/Board.js";
import { getThemeValue, setTheme } from "../common/helpers.js";
import { sizeSlider } from "../components/menu/elements.js";


const theme = getThemeValue();
setTheme(theme);

const size_unit = parseInt(sizeSlider.value);
const board = new Board(size_unit);








































